
const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");

const weatherDescriptions = {
    0: ["Clear Sky", "☀️"],
    1: ["Mainly Clear", "🌤️"],
    2: ["Partly Cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Foggy", "🌫️"],
    48: ["Foggy", "🌫️"],
    51: ["Light Drizzle", "🌦️"],
    53: ["Drizzle", "🌦️"],
    55: ["Heavy Drizzle", "🌧️"],
    61: ["Light Rain", "🌧️"],
    63: ["Rain", "🌧️"],
    65: ["Heavy Rain", "🌧️"],
    71: ["Light Snow", "🌨️"],
    73: ["Snow", "❄️"],
    75: ["Heavy Snow", "❄️"],
    80: ["Rain Showers", "🌦️"],
    81: ["Rain Showers", "🌧️"],
    82: ["Heavy Showers", "⛈️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with Hail", "⛈️"],
    99: ["Heavy Thunderstorm", "⛈️"]
};

async function getWeather(city) {
    try {
        message.textContent = "Loading weather information...";

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to search for this city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Try another name.");
        }

        const place = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather information.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        displayWeather(place, current);

        localStorage.setItem("lastCity", place.name);

        message.textContent = "Weather updated successfully!";

    } catch (error) {
        message.textContent = error.message;
    }
}

function displayWeather(place, current) {
    const weatherInfo =
        weatherDescriptions[current.weather_code] ||
        ["Unknown Condition", "🌍"];

    document.getElementById("weatherIcon").textContent =
        weatherInfo[1];

    document.getElementById("temperature").textContent =
        `${Math.round(current.temperature_2m)}°C`;

    document.getElementById("condition").textContent =
        weatherInfo[0];

    document.getElementById("location").textContent =
        `${place.name}, ${place.country}`;

    document.getElementById("dayStatus").textContent =
        current.is_day ? "☀️ Daytime" : "🌙 Nighttime";

    document.getElementById("humidity").textContent =
        `${current.relative_humidity_2m}%`;

    document.getElementById("wind").textContent =
        `${current.wind_speed_10m} km/h`;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
    }
});

// Load the last searched city
window.addEventListener("DOMContentLoaded", function() {
    const lastCity = localStorage.getItem("lastCity");

    if (lastCity) {
        cityInput.value = lastCity;
        getWeather(lastCity);
    }
});
