const getLatestWeatherForecast = require('/opt/nodejs/getLatestWeatherForecast');

exports.handler = async (event) => {
  const path = event.rawPath;
  const method = event.requestContext?.http?.method;

  if (path === '/weather' && method === 'GET') {
    const weatherForecast = await getLatestWeatherForecast();
    console.log('Weather Forecast', weatherForecast);

    return {
      statusCode: 200,
      body: JSON.stringify(weatherForecast, null, 2),
    };
  }
};
