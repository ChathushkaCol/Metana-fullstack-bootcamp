const weatherTaskSuggestions = {
  Sunny: ['Go for a walk', 'Have a picnic'],
  Rainy: ['Read a book', 'Clean your room'],
  Cloudy: ['Do some journaling', 'Organize files'],
  Snow: ['Make hot cocoa', 'Shovel snow'],
  'Partly cloudy': ['Stretch indoors', 'Catch up on a show']
};

document.getElementById('weather-btn').addEventListener('click', async () => {
  const modal = document.getElementById('weather-modal');
  const tempSpan = document.getElementById('weather-temp');
  const conditionSpan = document.getElementById('weather-condition');
  const humiditySpan = document.getElementById('weather-humidity');

  try {
    const res = await fetch('/api/weather');
    const data = await res.json();

    tempSpan.textContent = `${data.temp_c}°C`;
    conditionSpan.textContent = data.condition.text;
    humiditySpan.textContent = `${data.humidity}%`;

    modal.classList.remove('hidden');
  } catch (error) {
    tempSpan.textContent = `${data.temp_c}°C`;
conditionSpan.textContent = data.condition.text;
humiditySpan.textContent = `${data.humidity}%`;

showSuggestions(data.condition.text); // Add this line

    modal.classList.remove('hidden');
    console.error('Failed to fetch weather data:', error);
  }
});

function closeModal() {
  document.getElementById('weather-modal').classList.add('hidden');
}
function showSuggestions(condition) {
  const suggestionList = document.getElementById('suggested-tasks');
  suggestionList.innerHTML = '';

  const suggestions = weatherTaskSuggestions[condition] || ['Take a break', 'Relax'];

  suggestions.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task;
    suggestionList.appendChild(li);
  });
}


