function renderMoodSlider() {
  const modal = document.getElementById("mood-slider-modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Select Your Mood</h3>
      <select id="mood-select">
        <option value="happy">😊 Happy</option>
        <option value="sad">😢 Sad</option>
        <option value="stressed">😖 Stressed</option>
        <option value="bored">😐 Bored</option>
        <option value="energetic">⚡ Energetic</option>
      </select>
      <button onclick="applyMood()">Get Suggestion</button>
    </div>
  `;
  showModal("mood-slider-modal");
}

function applyMood() {
  const mood = document.getElementById("mood-select").value;
  renderSuggestedTask(mood);
  hideModal("mood-slider-modal");
  showToast(`🎯 Suggestion added for mood: ${mood}`);
}
document.getElementById("mood-btn").addEventListener("click", renderMoodSlider);
