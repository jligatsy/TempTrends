const API_KEY = 'e8d47242d044665cf81b3649df11fb18';

// Outfit suggestions from the Excel sheet
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


document.getElementById('getWeather').addEventListener('click', async () => {
  const city = document.getElementById('location').value;
  if (!city) return alert('Please enter a city name');

  try {
    const weather = await fetchWeather(city);
    displayWeather(weather);
    suggestOutfit(weather.main.temp); // Pass the temperature to suggestOutfit
  } catch (error) {
    console.error(error.message);
    alert('Could not fetch weather. Please try again.');
  }
});

// Fetch weather data from OpenWeatherMap
async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return await response.json();
}

// Display weather details dynamically on the webpage
function displayWeather(weather) {
  document.getElementById('city').textContent = weather.name;
  document.getElementById('country').textContent = weather.sys.country;
  document.getElementById('temperature').textContent = `${weather.main.temp}°F`;
  document.getElementById('feels_like').textContent = `${weather.main.feels_like}°F`;
  document.getElementById('description').textContent = weather.weather[0].description;
}

// Suggest outfit based on temperature and selected category
function suggestOutfit(temp) {
  // Get the selected category
  const category = document.getElementById("category").value;

  // Find the appropriate suggestion based on the temperature
  const suggestions = outfitMapping[category];
  const suggestion = suggestions.find(range => temp >= range.tempRange[0] && temp <= range.tempRange[1]);

  // Display the suggestion on the webpage
  document.getElementById('outfitSuggestions').textContent = 
    suggestion ? `Suggested Outfit: ${suggestion.suggestion}` : "No suggestion available for this temperature.";
}

