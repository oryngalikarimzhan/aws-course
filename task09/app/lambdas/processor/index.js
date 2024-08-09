const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient({ region: process.env.region });
const weatherTable = process.env.target_table;

exports.handler = async (event) => {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await res.json();

    console.log('WEATHER', JSON.stringify(data, null, 2));
    console.log('TABLE', weatherTable);

    const weatherItem = {
      id: crypto.randomUUID(),
      forecast: {
        elevation: data.elevation,
        generationtime_ms: data.generationtime_ms,
        latitude: data.latitude,
        longitude: data.longitude,
        utc_offset_seconds: data.utc_offset_seconds,
        timezone: data.timezone,
        timezone_abbreviation: data.timezone_abbreviation,
        hourly: {
          temperature_2m: data.hourly.temperature_2m,
          time: data.hourly.time,
        },
        hourly_units: {
          temperature_2m: data.hourly_units.temperature_2m,
          time: data.hourly_units.time,
        },
      },
    };

    await client.send(
      new PutItemCommand({
        TableName: weatherTable,
        Item: marshall(weatherItem),
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(data, null, 2),
    };
  } catch (e) {
    console.log(e);
  }
};
