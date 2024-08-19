const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "7c1a867fd3bedd4a0c11381666ddb0ce";

const createWeatherCard = (weatherItem) => {
    return `<li class="card">
                <h2>${weatherItem.dt_txt.split(" ")[0]}</h2>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                <h3>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h3>
                <h3>Humidity: ${weatherItem.main.humidity}%</h3>
                <h3>Wind: ${weatherItem.wind.speed} m/s</h3> 
            </li>`;
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            weatherCardsDiv.innerHTML = ''; // Clear previous results

            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            fiveDaysForecast.forEach(weatherItem => {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
            });
        })
        .catch(() => {
            alert("An error occurred while fetching the weather details!");
        });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                return alert(`No coordinates found for ${cityName}`);
            }
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
}

searchButton.addEventListener("click", getCityCoordinates);
