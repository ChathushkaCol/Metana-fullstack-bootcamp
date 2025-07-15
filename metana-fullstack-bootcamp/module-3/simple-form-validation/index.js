const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  validateInputs();
});

function setError(element, message) {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  if (errorDisplay) {
    errorDisplay.innerText = message;
  } else {
    const errorEl = document.createElement('div');
    errorEl.className = 'error';
    errorEl.innerText = message;
    inputControl.appendChild(errorEl);
  }

  element.classList.add('error-border');
  element.classList.remove('success-border');
}

function setSuccess(element) {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  if (errorDisplay) {
    errorDisplay.innerText = '';
  }

  element.classList.add('success-border');
  element.classList.remove('error-border');
}

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function validateInputs() {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  if (usernameValue === '') {
    setError(username, 'Username is required');
  } else {
    setSuccess(username);
  }

  if (emailValue === '') {
    setError(email, 'Email is required');
  } else if (!isValidEmail(emailValue)) {
    setError(email, 'Provide a valid email address');
  } else {
    setSuccess(email);
  }

  if (passwordValue === '') {
    setError(password, 'Password is required');
  } else if (passwordValue.length < 8) {
    setError(password, 'Password must be at least 8 characters');
  } else {
    setSuccess(password);
  }

  if (password2Value === '') {
    setError(password2, 'Please confirm your password');
  } else if (password2Value !== passwordValue) {
    setError(password2, 'Passwords do not match');
  } else {
    setSuccess(password2);
  }
}
