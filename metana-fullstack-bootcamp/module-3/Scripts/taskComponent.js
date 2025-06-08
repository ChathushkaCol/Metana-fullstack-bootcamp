function displayTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    if (task.isCompleted) taskDiv.classList.add("completed");

    taskDiv.innerHTML = `
      <span onclick="openEditTask(${task.id})">${task.title} — ${task.duration} mins @ ${task.time}</span>
      <div class="task-actions">
        <button onclick="completeTask(${task.id})">✔️</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;

    taskList.appendChild(taskDiv);
  });

  document.getElementById("task-count").textContent = `${tasks.length} Tasks`;
}
function deleteTask(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updated = tasks.filter(task => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(updated));
  displayTasks();
  showToast("🗑️ Task deleted");
}
function openEditTask(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks.find(t => t.id === id);
  const modal = document.getElementById("edit-task-modal");

  modal.innerHTML = `
    <div class="modal-content">
      <h2>Edit Task</h2>
      <input type="text" id="edit-title" value="${task.title}" />
      <input type="number" id="edit-duration" value="${task.duration}" />
      <input type="time" id="edit-time" value="${task.time}" />
      <button onclick="saveTaskChanges(${id})">Save Changes</button>
    </div>
  `;

  showModal("edit-task-modal");
}
function saveTaskChanges(id) {
  const title = document.getElementById("edit-title").value.trim();
  const duration = parseInt(document.getElementById("edit-duration").value);
  const time = document.getElementById("edit-time").value;

  if (!title || !duration || !time) {
    showToast("❌ Please fill in all fields");
    return;
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updated = tasks.map(t => 
    t.id === id ? { ...t, title, duration, time } : t
  );

  localStorage.setItem("tasks", JSON.stringify(updated));
  hideModal("edit-task-modal");
  displayTasks();
  showToast("✅ Task updated");
}

