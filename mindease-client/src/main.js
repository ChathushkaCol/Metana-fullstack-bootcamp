import { createClient } from '@supabase/supabase-js'

// ---------- Supabase ----------
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ---------- State ----------
let user = null
let timer = { running: false, startTs: 0, elapsed: 0, int: null }

// ---------- Helpers ----------
const $ = (sel) => document.querySelector(sel)
const fmtMin = (ms) => Math.max(1, Math.round(ms / 60000))
const guard = async () => {
  const { data } = await supabase.auth.getUser()
  user = data?.user ?? null
  route()
}

async function signInOrUp(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    const { error: upErr } = await supabase.auth.signUp({ email, password })
    if (upErr) return uiStatus(`❌ ${upErr.message}`)
    uiStatus(`✅ Account created — check email to confirm, then log in.`)
  } else {
    uiStatus(`✅ Welcome back, ${email}`)
  }
  await guard()
}

async function signOut() {
  await supabase.auth.signOut()
  user = null
  route()
}

function uiStatus(msg) {
  const el = $('#status'); if (!el) return
  el.textContent = msg
}

// ---------- Timer ----------
function startTimer() {
  if (timer.running) return
  timer.running = true
  timer.startTs = Date.now() - timer.elapsed
  timer.int = setInterval(renderTimer, 200)
}
function pauseTimer() {
  if (!timer.running) return
  timer.running = false
  clearInterval(timer.int)
  timer.elapsed = Date.now() - timer.startTs
  renderTimer()
}
function resetTimer() {
  timer.running = false
  clearInterval(timer.int)
  timer.elapsed = 0
  renderTimer()
}
function renderTimer() {
  const ms = timer.running ? Date.now() - timer.startTs : timer.elapsed
  const mins = Math.floor(ms / 60000)
  const secs = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0')
  const el = $('#timerReadout'); if (el) el.textContent = `${mins}:${secs}`
}

// ---------- Data ----------
async function saveSession({ minutes, mood, note }) {
  if (!user) return uiStatus('Please log in first.')
  const { error } = await supabase
    .from('meditation_sessions')
    .insert([{ user_id: user.id, minutes, mood, note }])
  if (error) return uiStatus(`❌ ${error.message}`)
  uiStatus('✅ Session saved!')
  await loadSessions()
  resetTimer()
}

async function loadSessions() {
  if (!user) return
  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('id, started_at, minutes, mood, note')
    .order('started_at', { ascending: false })
    .limit(10)
  if (error) return uiStatus(`❌ ${error.message}`)
  const list = $('#sessionList')
  if (!list) return
  list.innerHTML = (data ?? []).map(s => `
    <li style="padding:.6rem;border-bottom:1px solid #eee">
      <b>${new Date(s.started_at).toLocaleString()}</b> • ${s.minutes} min
      ${s.mood ? `• ${s.mood}` : ''} ${s.note ? `— ${s.note}` : ''}
    </li>
  `).join('') || `<li>No sessions yet.</li>`
}

// ---------- Views ----------
function renderAuth() {
  document.body.innerHTML = `
    <main style="max-width:760px;margin:4rem auto;text-align:center;font-family:system-ui">
      <h1 style="font-size:2.4rem;color:#0f172a">MindEase v2 🌿</h1>
      <p style="color:#64748b;margin:.5rem 0 2rem">Sign up or log in to continue your meditation journey.</p>
      <form id="authForm" style="display:flex;gap:.6rem;justify-content:center">
        <input id="email" type="email" placeholder="Email" required style="padding:.6rem;width:260px;border:1px solid #dcdcdc;border-radius:8px;">
        <input id="password" type="password" placeholder="Password" required style="padding:.6rem;width:240px;border:1px solid #dcdcdc;border-radius:8px;">
        <button style="padding:.6rem 1rem;background:#16a34a;color:#fff;border:none;border-radius:8px;cursor:pointer">Sign In / Up</button>
      </form>
      <div id="status" style="margin-top:1rem;color:#0f172a;font-weight:600"></div>
    </main>
  `
  $('#authForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    await signInOrUp($('#email').value, $('#password').value)
  })
}

function renderDashboard() {
  document.body.innerHTML = `
    <header style="max-width:900px;margin:1.5rem auto;display:flex;justify-content:space-between;align-items:center;font-family:system-ui">
      <h2 style="margin:0;color:#0f172a">MindEase v2 🌿</h2>
      <div>
        <span style="margin-right:1rem;color:#475569">${user?.email ?? ''}</span>
        <button id="logoutBtn" style="padding:.4rem .8rem;border:1px solid #cbd5e1;border-radius:8px;background:#fff;cursor:pointer">Logout</button>
      </div>
    </header>

    <main style="max-width:900px;margin:1rem auto;font-family:system-ui">
      <section style="padding:1rem;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:1rem">
        <h3 style="margin:.2rem 0 1rem">Meditation Timer</h3>
        <div style="display:flex;align-items:center;gap:1rem">
          <div id="timerReadout" style="font-size:2.4rem;min-width:120px;">0:00</div>
          <button id="startBtn">Start</button>
          <button id="pauseBtn">Pause</button>
          <button id="resetBtn">Reset</button>
          <select id="moodSel">
            <option value="">Mood (optional)</option>
            <option>calm</option><option>focused</option><option>stressed</option>
          </select>
          <input id="noteInp" placeholder="Note (optional)" style="flex:1;padding:.4rem;border:1px solid #cbd5e1;border-radius:8px">
          <button id="saveBtn" style="background:#16a34a;color:#fff;border:none;border-radius:8px;padding:.5rem .9rem;cursor:pointer">Save Session</button>
        </div>
        <div id="status" style="margin-top:.8rem;color:#0f172a;font-weight:600"></div>
      </section>

      <section style="padding:1rem;border:1px solid #e2e8f0;border-radius:12px">
        <h3 style="margin:.2rem 0 1rem">Recent Sessions</h3>
        <ul id="sessionList" style="list-style:none;padding:0;margin:0"></ul>
      </section>
    </main>
  `
  $('#logoutBtn').addEventListener('click', signOut)
  $('#startBtn').addEventListener('click', startTimer)
  $('#pauseBtn').addEventListener('click', pauseTimer)
  $('#resetBtn').addEventListener('click', resetTimer)
  $('#saveBtn').addEventListener('click', async () => {
    const ms = timer.running ? Date.now() - timer.startTs : timer.elapsed
    const minutes = fmtMin(ms)
    await saveSession({
      minutes,
      mood: $('#moodSel').value || null,
      note: $('#noteInp').value || null
    })
  })
  renderTimer()
  loadSessions()
}

// ---------- Router ----------
function route() {
  if (!user) renderAuth()
  else renderDashboard()
}

// ---------- Boot ----------
supabase.auth.onAuthStateChange((_e, session) => {
  user = session?.user ?? null
  route()
})
guard()
