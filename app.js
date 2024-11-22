const API_KEY = 'e8d47242d044665cf81b3649df11fb18';

document.getElementById('getWeather').addEventListener('click', async () => {
  const city = document.getElementById('location').value;
  if (!city) return alert('Please enter a city name');

  try {
    const weather = await fetchWeather(city);
    displayWeather(weather);
    suggestOutfit(weather);
  } catch (error) {
    console.error(error.message);
    alert('Could not fetch weather. Please try again.');
  }
});

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return await response.json();
}

function displayWeather(weather) {
  const weatherIconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  document.getElementById('city').textContent = weather.name;
  document.getElementById('country').textContent = weather.sys.country;
  document.getElementById('temperature').textContent = weather.main.temp;
  document.getElementById('feels_like').textContent = weather.main.feels_like;
  document.getElementById('description').textContent = weather.weather[0].description;
  document.getElementById('wind_speed').textContent = weather.wind.speed;
  document.getElementById('humidity').textContent = weather.main.humidity;
  document.getElementById('sunrise').textContent = new Date(weather.sys.sunrise * 1000).toLocaleTimeString();
  document.getElementById('sunset').textContent = new Date(weather.sys.sunset * 1000).toLocaleTimeString();
  document.getElementById('weatherIcon').src = weatherIconUrl;
}

function suggestOutfit(weather) {
  let suggestion = 'Wear something comfortable.';
  if (weather.main.temp < 10) suggestion = 'It’s cold! Wear a coat, scarf, and gloves.';
  else if (weather.main.temp > 25) suggestion = 'It’s warm! Wear light clothes.';
  else if (weather.weather[0].main === 'Rain') suggestion = 'Bring an umbrella or wear a raincoat.';

  document.getElementById('outfitSuggestions').textContent = suggestion;
}
