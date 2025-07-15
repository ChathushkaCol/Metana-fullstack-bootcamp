const moodTasks = {
  happy: "Go for a walk ☀️",
  sad: "Write in a journal 📓",
  stressed: "Try 5-min breathing exercise 🧘",
  bored: "Read a chapter from a book 📖",
  energetic: "Do 10 pushups 💪"
};

function renderSuggestedTask(mood = "happy") {
  const task = moodTasks[mood] || "Take a short break 💤";
  const container = document.getElementById("suggested-task-list");
  container.innerHTML = `<div class="suggested-task">${task}</div>`;
}
