

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const backlogList = document.getElementById('backlog-tasks');
  const completedList = document.getElementById('completed-tasks');

  backlogList.innerHTML = '';
  completedList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.title;

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = task.status === 'backlog' ? '✔️' : '↩️';
    toggleBtn.onclick = () => toggleTaskStatus(task.id);

    li.appendChild(toggleBtn);

    if (task.status === 'backlog') {
      backlogList.appendChild(li);
    } else {
      completedList.appendChild(li);
    }
  });
}

function toggleTaskStatus(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const task = tasks.find(t => t.id === id);

  if (task) {
    task.status = task.status === 'backlog' ? 'completed' : 'backlog';
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks(); // Refresh list
  }
}

// Toggle completed section
document.getElementById('toggle-completed-btn').addEventListener('click', () => {
  document.getElementById('completed-section').classList.toggle('hidden');
});

// Load tasks on page load
window.onload = loadTasks;

