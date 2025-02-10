// script.js
const apiKey = '5486fac1d8ce9d74347324888b3fc780'; 
const searchButton = document.getElementById('search-button');
const locationButton = document.getElementById('location-button');
const cityInput = document.getElementById('city-input');
const weatherData = document.getElementById('weather-data');
const weatherChart = document.getElementById('weather-chart').getContext('2d');
const themeToggle = document.getElementById('theme-toggle');
const hourlyForecastButton = document.getElementById('hourly-forecast');
const weeklyForecastButton = document.getElementById('weekly-forecast');

let chartInstance = null;
let currentTheme = 'light';

// Theme Toggle
themeToggle.addEventListener('change', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', currentTheme);
});

// Fetch Weather by City
async function fetchWeather(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    displayWeather(data);
    createChart(data);
  } catch (error) {
    weatherData.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// Fetch Weather by Geolocation
locationButton.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
        if (!response.ok) throw new Error('Unable to fetch weather data');
        const data = await response.json();
        displayWeather(data);
        createChart(data);
      } catch (error) {
        weatherData.innerHTML = `<p class="error">Error: ${error.message}</p>`;
      }
    }, (error) => {
      weatherData.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    });
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});

// Display Weather Data
function displayWeather(data) {
  const { city, list } = data;
  const weatherIcon = list[0].weather[0].icon;
  weatherData.innerHTML = `
    <h2>${city.name}, ${city.country}</h2>
    <p><i class="fas fa-thermometer-half"></i> Temperature: ${list[0].main.temp}°C</p>
    <p><i class="fas fa-cloud"></i> Condition: ${list[0].weather[0].description}</p>
    <p><i class="fas fa-tint"></i> Humidity: ${list[0].main.humidity}%</p>
    <p><i class="fas fa-wind"></i> Wind Speed: ${list[0].wind.speed} m/s</p>
    <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather Icon" class="weather-icon">
  `;
}

// Create Chart
function createChart(data) {
  const labels = data.list.slice(0, 7).map(item => new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const temps = data.list.slice(0, 7).map(item => item.main.temp);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(weatherChart, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temps,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          fill: true,
          tension: 0.4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#fff',
          },
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#fff',
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff',
          },
        },
      },
    },
  });
}

// Event Listeners
searchButton.addEventListener('click', () => {
  const city = cityInput.value;
  if (city) fetchWeather(city);
});

hourlyForecastButton.addEventListener('click', () => {
  hourlyForecastButton.classList.add('active');
  weeklyForecastButton.classList.remove('active');
  // Add logic for hourly forecast
});

weeklyForecastButton.addEventListener('click', () => {
  weeklyForecastButton.classList.add('active');
  hourlyForecastButton.classList.remove('active');
  // Add logic for weekly forecast
});