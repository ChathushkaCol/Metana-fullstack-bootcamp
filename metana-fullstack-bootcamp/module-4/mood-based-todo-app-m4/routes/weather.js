const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/weather', async (req, res) => {
  const lat = 40.7128; // You can later replace with dynamic location
  const lon = -74.0060;
  const apiKey = 'b6eef3f0b465464e828165802251206'; // Replace this

  try {
    const result = await axios.get(`http://api.weatherapi.com/v1/current.json`, {
      params: {
        key: apiKey,
        q: `${lat},${lon}`,
      }
    });

    const weather = result.data.current;
    res.json({
      temp_c: weather.temp_c,
      humidity: weather.humidity,
      condition: weather.condition,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

module.exports = router;
