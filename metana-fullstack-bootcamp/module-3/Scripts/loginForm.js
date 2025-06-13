// Helper to show/hide modals
function showModal(id) {
  document.getElementById(id).classList.remove("hidden");
}
function hideModal(id) {
  document.getElementById(id).classList.add("hidden");
}

// Render Login Form
function renderLoginForm() {
  const modal = document.getElementById("login-modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Welcome Back!</h2>
      <p>Please enter your details to login</p>
      <input type="text" id="login-name" placeholder="Name" />
      <input type="email" id="login-email" placeholder="Email" />
      <input type="password" id="login-password" placeholder="Password" />
      <button onclick="handleLogin()">Login</button>
    </div>
  `;
  showModal("login-modal");
}
function handleLogin() {
  const name = document.getElementById("login-name").value.trim();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email.includes("@") || password.length < 8) {
    showToast("❌ Please enter a valid email and password (min 8 characters)");
    return;
  }

  const user = { name, email };
  localStorage.setItem("user", JSON.stringify(user));
  updateUsername();
  hideModal("login-modal");
  showToast("✅ Login successful");
}
function updateUsername() {
  const user = JSON.parse(localStorage.getItem("user"));
  const usernameEl = document.getElementById("username");
  usernameEl.textContent = user ? user.name : "Guest";
}
document.getElementById("profile-btn").addEventListener("click", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    renderEditProfileForm(user);
  } else {
    renderLoginForm();
  }
});
function renderEditProfileForm(user) {
  const modal = document.getElementById("profile-modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Profile Settings</h2>
      <input type="text" id="edit-name" value="${user.name}" />
      <input type="email" id="edit-email" value="${user.email}" />
      <button onclick="saveProfileChanges()">Save Changes</button>
      <button onclick="logout()" style="background-color:red;">Logout</button>
    </div>
  `;
  showModal("profile-modal");
}

function saveProfileChanges() {
  const name = document.getElementById("edit-name").value.trim();
  const email = document.getElementById("edit-email").value.trim();
  if (!email.includes("@")) {
    showToast("❌ Invalid email");
    return;
  }
  localStorage.setItem("user", JSON.stringify({ name, email }));
  updateUsername();
  hideModal("profile-modal");
  showToast("✅ Profile updated");
}

function logout() {
  localStorage.removeItem("user");
  updateUsername();
  hideModal("profile-modal");
  renderLoginForm();
  showToast("✅ Logged out");
}

