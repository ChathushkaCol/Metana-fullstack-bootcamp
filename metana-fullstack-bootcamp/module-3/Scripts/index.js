function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

// On page load
window.onload = () => {
  updateUsername(); // from loginForm.js
};
window.onload = () => {
  updateUsername();
  displayTasks();
};
window.onload = () => {
  updateUsername();
  displayTasks();
  renderSuggestedTask(); // default happy
};

