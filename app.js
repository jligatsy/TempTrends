const API_KEY = 'e8d47242d044665cf81b3649df11fb18';

let currentTemperature = null;

// outfit suggestions from A4 google sheet
const outfitMapping = {
  business: [
    { tempRange: [0, 50], suggestion: "Suit/Blazer, Scarf, Overcoat, Leather Shoes" },
    { tempRange: [51, 70], suggestion: "Polo Shirt, Khakis, Light Cardigan" },
    { tempRange: [71, 100], suggestion: "Short-sleeved Button-up, Looser Pants, Loafers" },
  ],
  athletic: [
    { tempRange: [0, 50], suggestion: "Beanie, Puffer Jacket, Crewneck, Joggers, Running Shoes" },
    { tempRange: [51, 70], suggestion: "Lightweight Jacket, Compression Pants, Sneakers" },
    { tempRange: [71, 100], suggestion: "Performance Tank, Running Shorts, Trainers" },
  ],
  casual: [
    { tempRange: [0, 50], suggestion: "Knit Sweater, Puffer Jacket, Jeans, Boots" },
    { tempRange: [51, 70], suggestion: "Hoodie, Jeans, Sneakers" },
    { tempRange: [71, 100], suggestion: "Lightweight Shirt, Cotton Shorts, Sandals" },
  ],
  stayAtHomeMom: [
    { tempRange: [0, 50], suggestion: "Knitted Cardigan, Warm Joggers, Slippers, Wool Socks" },
    { tempRange: [51, 70], suggestion: "Lightweight Sweater, Leggings, Comfortable Flats" },
    { tempRange: [71, 100], suggestion: "Lightweight Tank, Capri Pants, Comfortable Sandals" },
  ],
  kids: [
    { tempRange: [0, 50], suggestion: "Warm Coat, Wool Hat, Gloves, Jeans, Snow Boots" },
    { tempRange: [51, 70], suggestion: "Pullover Sweater, Denim, Sneakers" },
    { tempRange: [71, 100], suggestion: "Cotton T-shirt, Shorts, Sandals" },
  ],
};

// function to call displayWeather and suggestOutfit or error message 
document.getElementById('getWeather').addEventListener('click', async () => {
  const city = document.getElementById('location').value;
  if (!city) return alert('Please enter a city name');

  try {
    const weather = await fetchWeather(city);
    displayWeather(weather);
    currentTemperature = weather.main.temp;
    suggestOutfit(); 
  } catch (error) {
    console.error(error.message);
    alert('That city is unrecognizable. Please try again.');
  }
});

// function to call suggestOutfit or error message 
document.getElementById('updateCategory').addEventListener('click', () => {
  if (currentTemperature === null) {
    alert('Please get the weather first!');
    return;
  }
  suggestOutfit(); 
});

// fetching weather data from OpenWeatherMap
async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return await response.json();
}

// function to display weather details dynamically on the webpage
function displayWeather(weather) {
  document.getElementById('city').textContent = weather.name;
  document.getElementById('country').textContent = weather.sys.country;
  document.getElementById('temperature').textContent = `${weather.main.temp}°F`;
  document.getElementById('feels_like').textContent = `${weather.main.feels_like}°F`;
  document.getElementById('description').textContent = weather.weather[0].description;
  document.getElementById('wind_speed').textContent = weather.wind.speed;
  document.getElementById('humidity').textContent = weather.main.humidity;
  document.getElementById('sunrise').textContent = new Date(weather.sys.sunrise * 1000).toLocaleTimeString();
  document.getElementById('sunset').textContent = new Date(weather.sys.sunset * 1000).toLocaleTimeString();
  document.getElementById('weather').style.display = 'block';

  // function to display the weather icon
  const weatherIcon = document.getElementById('weatherIcon');
  const iconCode = weather.weather[0].icon; 
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; 
  weatherIcon.alt = weather.weather[0].description; 
  weatherIcon.style.display = 'block'; // toggle to make icon visible? 
}


// function to suggest outfit based on temperature and selected category
function suggestOutfit() {
  const category = document.getElementById("category").value;
  const suggestions = outfitMapping[category];
  const suggestion = suggestions.find(range => currentTemperature >= range.tempRange[0] && currentTemperature <= range.tempRange[1]);
  const outfitList = document.getElementById('outfitSuggestions');
  outfitList.innerHTML = ''; // clear any existing suggestions? 
  // split the suggestion into individual items (assuming comma-separated)
  const items = suggestion.suggestion.split(', ');

  // create a list item for each outfit item and append it to the list
  items.forEach(item => {
  const listItem = document.createElement('li');
  listItem.textContent = item;
  outfitList.appendChild(listItem);
    });
}
