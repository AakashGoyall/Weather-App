import config from "./config.js";

let citySearch = document.querySelector(".weather_search");
let clearSearch = document.querySelector(".fa-xmark");
let cityName = document.querySelector(".weather_city");
let dateTime = document.querySelector(".weather_time_date");
let w_forecast = document.querySelector(".weather_forecast");
let w_icon = document.querySelector(".weather_icon");
let w_temperature = document.querySelector(".weather_temperature");
let w_minTem = document.querySelector(".weather_min");
let w_maxTem = document.querySelector(".weather_max");
let feelsLike = document.querySelector(".weather_feels");
let humidity = document.querySelector(".weather_humidity");
let windSpeed = document.querySelector(".weather_wind");
let pressure = document.querySelector(".weather_pressure");
let city = document.querySelector(".city_name");
let bg = document.querySelector("#bg");
let preLoader = document.getElementById("loading");
let apiId = config.API_KEY; // Use your own API key here

// Function to use speech synthesis for speaking the city name
const speak = (text) => {
  let text_speak = new SpeechSynthesisUtterance(text);
  text_speak.rate = 0.5;
  text_speak.volume = 2;
  text_speak.pitch = 1;
  text_speak.lang = "en-US";
  window.speechSynthesis.speak(text_speak);
};

// Default city name for weather search
let search = "london";

// Update background based on the time of day
let hour = new Date().getHours();
if (hour <= 6) {
  bg.style.background = `url("./img/Weather-1.webp")`;
} else if (hour <= 12) {
  bg.style.background = `url("./img/Weather-2.webp")`;
}

// Hide the loader when the page is fully loaded
window.addEventListener("load", () => {
  preLoader.style.display = "none";
});

// Handle the city search submission to fetch weather data
citySearch.addEventListener("submit", (e) => {
  e.preventDefault();
  search = city.value;
  getWeatherData();
  city.value = "";
  clearSearch.style.display = "none";
});

// Allow only alphabets in the city input field
document.addEventListener("DOMContentLoaded", () => {
  const alphabetInput = document.querySelector("#alphabetInput");
  alphabetInput.addEventListener("input", (e) => {
    let inputValue = e.target.value;
    let alphabetRegx = /^[A-Za-z\s]*$/;
    if (!alphabetRegx.test(inputValue)) {
      e.target.value = inputValue.slice(0, -1);
    }
  });
});

// Clear the search field when the 'x' icon is clicked
city.addEventListener("keyup", (c) => {
  if (c.key === "Backspace" || c.key === "Delete") {
    clearSearch.style.display = "none";
  }
  if (city.value.length > 0) {
    clearSearch.style.display = "inline";
    clearSearch.addEventListener("click", () => {
      city.value = "";
      clearSearch.style.display = "none";
    });
  }
});

// Format and display the current time and date
const getCurrentTime = (dt) => {
  const curTime = new Date(dt * 1000);
  const fullTime = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", fullTime).format(curTime);
};

// Convert country code to the country name
const getCountryName = (code) => {
  return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
};

// Fetch weather data from the OpenWeatherMap API and update UI
const getWeatherData = async () => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${apiId}`;
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    const { main, name, weather, wind, sys, dt } = data;

    // Set the background image based on the weather condition
    switch (weather[0].main) {
      case "Haze":
        bg.style.background = 'url("background/Haze.jpeg")';
        break;
      case "Smoke":
        bg.style.background = 'url("background/Smoke.jpeg")';
        break;
      case "Clouds":
        bg.style.background = 'url("background/Clouds.jpeg")';
        break;
      case "Snow":
        bg.style.background = 'url("background/Snow.jpeg")';
        break;
      case "Thunder":
        bg.style.background = 'url("background/Thunder.jpeg")';
        break;
      case "Windy":
        bg.style.background = 'url("background/Windy.jpeg")';
        break;
      case "Rain":
        bg.style.background = 'url("background/rain.jpeg")';
        break;
      case "Sunny":
        bg.style.background = 'url("background/Sunny.jpeg")';
        break;
      case "Clear":
        bg.style.background = 'url("background/Clear.jpeg")';
        break;
      default:
        bg.style.background = 'url("background/Weather.jpeg")';
    }
    bg.style.backgroundSize = 'cover';
    bg.style.backgroundPosition = 'center';

    // Update UI with weather data
    speak(name);
    cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
    dateTime.innerHTML = getCurrentTime(dt);
    w_forecast.innerHTML = `${weather[0].main}`;
    w_icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather[0].icon}@4x.png"/>`;
    w_temperature.innerHTML = `${main.temp.toFixed()}&#176;`;
    w_minTem.innerHTML = `Min: ${main.temp_min.toFixed()}&#176;`;
    w_maxTem.innerHTML = `Max: ${main.temp_max.toFixed()}&#176;`;
    feelsLike.innerHTML = `${main.feels_like.toFixed()}&#176;`;
    humidity.innerHTML = `${main.humidity}%`;
    windSpeed.innerHTML = `${wind.speed} m/s`;
    pressure.innerHTML = `${main.pressure} hPa`;

  } catch (error) {
    console.log(error);
  }
};

// Fetch initial weather data when the page loads
window.addEventListener("load", getWeatherData);
