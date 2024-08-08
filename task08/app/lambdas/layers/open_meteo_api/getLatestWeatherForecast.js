const axios = require('axios');

async function getLatestWeatherForecast() {
  const response = await axios.get(
    'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m'
  );

  console.log(JSON.stringify(response.data, null, 2));
  return response.data;
}

getLatestWeatherForecast();
module.exports = getLatestWeatherForecast;
