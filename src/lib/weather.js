const API_URL = 'https://api.open-meteo.com/v1/forecast';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @typedef {Object} Forecast
 * @property {string} time
 * @property {number} temperature
 * @property {number} precipitation
 */

/**
 * Tekur við gögnum frá Open Meteo og skilar fylki af spám í formi Forecast.
 * @param {unknown} data Gögn frá Open Meteo.
 * @returns {Array<Forecast>}
 */
function parseResponse(data) {
  // Check if the expected properties exist in the data
  if (!data || !data.hourly || !data.hourly.time || !data.hourly.temperature_2m || !data.hourly.precipitation) {
    console.error('Invalid data structure:', data);
    return [];
  }

  // Create an array of Forecast objects from the response
  return data.hourly.time.map((time, index) => ({
    time: time,
    temperature: data.hourly.temperature_2m[index],
    precipitation: data.hourly.precipitation[index] || 0, // Default to 0 if no data
  }));
}

/**
 * Framkvæmir leit að veðurspám fyrir gefna staðsetningu.
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<Array<Forecast>>} Fylki af spám fyrir staðsetningu.
 */
export async function weatherSearch(lat, lng) {
  await sleep(1000);
  
  // Querystring sem við viljum senda með leit
  const url = new URL(API_URL);
  const querystring = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    hourly: 'temperature_2m,precipitation',
    forecast_days: '1',
    timezone: 'GMT', // Added timezone as per your original comment
  });
  
  url.search = querystring.toString();

  const response = await fetch(url.href);

  if (response.ok) {
    const data = await response.json();
    return parseResponse(data);
  } else {
    console.error('Error fetching weather data:', response.statusText);
    throw new Error('Failed to fetch weather data');
  }
}
