function renderTaskForm() {
  const modal = document.getElementById("task-form-modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Create Task</h2>
      <input type="text" id="task-title" placeholder="Task Title" />
      <input type="number" id="task-duration" placeholder="Duration (mins)" />
      <input type="time" id="task-time" />
      <button onclick="createTask()">Create Task</button>
    </div>
  `;
  showModal("task-form-modal");
}
document.getElementById("add-task-btn").addEventListener("click", renderTaskForm);
function createTask() {
  const title = document.getElementById("task-title").value.trim();
  const duration = parseInt(document.getElementById("task-duration").value);
  const time = document.getElementById("task-time").value;

  if (!title || !duration || !time) {
    showToast("❌ Please fill in all fields");
    return;
  }

  const task = {
    id: Date.now(), // unique ID
    title,
    duration,
    time,
    isCompleted: false,
  };

  // Get existing tasks
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  hideModal("task-form-modal");
  showToast("✅ Task added");
  displayTasks(); // re-render task list
}
