import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const app = document.querySelector('#app')
app.innerHTML = `
  <main style="max-width:740px;margin:6rem auto;text-align:center;font-family:system-ui">
    <h1 style="font-size:2.4rem;color:#0f172a">MindEase 🌿</h1>
    <p style="color:#64748b;margin-bottom:2rem">
      Sign up or log in to continue your meditation journey.
    </p>

    <form id="authForm" style="margin-bottom:2rem;">
      <input id="email" type="email" placeholder="Email" required
        style="padding:.6rem;width:240px;margin-right:.5rem;border:1px solid #ccc;border-radius:6px;">
      <input id="password" type="password" placeholder="Password" required
        style="padding:.6rem;width:240px;margin-right:.5rem;border:1px solid #ccc;border-radius:6px;">
      <button type="submit"
        style="padding:.6rem 1.2rem;background:#16a34a;color:white;border:none;border-radius:6px;cursor:pointer;">
        Sign In / Up
      </button>
    </form>

    <button id="logoutBtn" style="display:none;padding:.6rem 1.2rem;border:1px solid #ccc;border-radius:6px;">
      Logout
    </button>

    <div id="status" style="margin-top:1.5rem;color:#0f172a;font-weight:600;"></div>
  </main>
`

const authForm = document.getElementById('authForm')
const logoutBtn = document.getElementById('logoutBtn')
const statusDiv = document.getElementById('status')

// try to restore existing session
;(async () => {
  const { data } = await supabase.auth.getUser()
  if (data?.user) {
    statusDiv.textContent = `🔐 Logged in as ${data.user.email}`
    logoutBtn.style.display = 'inline-block'
    authForm.style.display = 'none'
  }
})()

authForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const { error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) statusDiv.textContent = `❌ ${signUpError.message}`
    else statusDiv.textContent = `✅ Account created! Check your email to confirm, then log in.`
  } else {
    statusDiv.textContent = `✅ Logged in as ${email}`
    logoutBtn.style.display = 'inline-block'
    authForm.style.display = 'none'
  }
})

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut()
  statusDiv.textContent = '👋 Logged out.'
  logoutBtn.style.display = 'none'
  authForm.style.display = 'block'
})
