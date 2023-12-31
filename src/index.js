const searchForm = document.querySelector(".form");
const units = document.querySelectorAll(".units button");
const unitsArray = Array.from(units);
const currentDayEl = document.querySelector(".current-day");
const currentCityBtn = document.querySelector(".btn-current");
 const forecastEl = document.querySelector(".forecast");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let weekday;
searchCurrentCity();
searchForm.addEventListener("submit", searchCity);
currentCityBtn.addEventListener("click", searchCurrentCity);
function searchCity(event) {
  event.preventDefault();
  const cityInput = document.querySelector(".city-input");
  const currentCity = cityInput.value.trim().toLowerCase();
  const keyAPI = "e6c2364656962bdcb16bc352fc42569a";
  let getedAPI = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${keyAPI}&units=metric`;
  serviceAPI(getedAPI);
}
function searchCurrentCity(event) {
  if (event) {
    event.preventDefault();
  }

  navigator.geolocation.getCurrentPosition(getPosition);
  function getPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    const keyAPI = "e6c2364656962bdcb16bc352fc42569a";
    let getedAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keyAPI}&units=metric`;
    serviceAPI(getedAPI);
  }
}
function serviceAPI(getedAPI) {
  axios
    .get(getedAPI)
    .then(displayThemp)
    .catch(function (error) {
      console.log(error);
    });
}

function displayThemp(response) {
  forecastEl.innerHTML = "";
  unitsArray[0].classList.add("active");
  unitsArray[1].classList.remove("active");
  const temperature = document.querySelector(".temperature");
  const currentCityEl = document.querySelector(".city");
  const windEl = document.querySelector(".wind span");
  const humidityEl = document.querySelector(".humidity span");
  const iconEl = document.querySelector(".icon");
  const descriptionEl = document.querySelector(".description");
  const temp = Math.round(response.data.main.temp);
  const humidity = Math.round(response.data.main.humidity);
  const windSpeed = Math.round(response.data.wind.speed);
  const description = response.data.weather[0].description;
  const city = response.data.name;
  temperature.innerHTML = temp;
  currentCityEl.innerHTML = city;
  windEl.innerHTML = windSpeed;
  humidityEl.innerHTML = humidity;
  descriptionEl.innerHTML = description;
  iconEl.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconEl.setAttribute("alt", `${response.data.weather[0].description}`);

  displayCurrentDay();
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  getForecast(lat, lon, weekday);
  units.forEach((unit) => addListenerForUnits(unit, temp));
}
function addListenerForUnits(unit, CTemperature) {
  const temperature = document.querySelector(".temperature");
  unit.addEventListener("click", (event) => {
    if (event.target === unitsArray[0]) {
      temperature.textContent = CTemperature;
      unitsArray[0].classList.add("active");
      unitsArray[1].classList.remove("active");
    }
    if (event.target === unitsArray[1]) {
      temperature.textContent = Math.round(CTemperature * 1.8 + 32);
      unitsArray[1].classList.add("active");
      unitsArray[0].classList.remove("active");
    }
  });
}
function displayCurrentDay() {
  let date = new Date();
  weekday = weekdays[date.getDay()];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let day = date.getDate();
  let year = date.getFullYear();
  let time = `${date.getUTCHours()}:${date.getUTCMinutes()}`;
  currentDayEl.innerHTML = `${weekday} ${time}, ${month} ${day}, ${year}`;
  return weekday;
}
// const selectedCity = prompt("Enter a city").trim().toLowerCase();
// if (Object.keys(weather).includes(selectedCity)) {
//   const currentCity =
//     selectedCity.slice(0, 1).toUpperCase() + selectedCity.slice(1);
//   const currentCityTempC = Math.round(weather[selectedCity].temp);
//   const currentCityTempF = currentCityTempC * 1.8 + 32;
//   const currentCityHumidity = Math.round(weather[selectedCity].humidity);
//   alert(
//     `It is currently ${currentCityTempC}°C (${currentCityTempF}°F) in ${currentCity} with a humidity of ${currentCityHumidity}%`
//   );
// } else {
//   alert(
//     `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${selectedCity}`
//   );
// }
function getForecast(lat, lon) {
  const keyAPI = "e6c2364656962bdcb16bc352fc42569a";
  let getedAPIForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${keyAPI}&units=metric`;
  axios
    .get(getedAPIForecast)
    .then(displayForecast)
    .catch(function (error) {
      console.log(error);
    });
}
function displayForecast(r) {
  const currentDayIndex = weekdays.indexOf(weekday);
  if (currentDayIndex === -1) {
    throw new Error("Invalid currentDay");
  }
  const nextWeekdays = [
    ...weekdays.slice(currentDayIndex + 1),
    ...weekdays.slice(0, currentDayIndex),
  ];
  const forecast = r.data.daily;
  const markup = nextWeekdays
    .map((day, index) => {
      return `<li class="col card">
      <div>${day}</div>
      <img src="https://openweathermap.org/img/wn/${forecast[index + 1].weather[0].icon}@2x.png" 
      alt="${forecast[index + 1].weather[0].description}" />
      <div>
      <span class="tmp min">
      ${Math.round(forecast[index + 1].temp.min)}°C /</span>
      <span class="tmp max"> ${Math.round(forecast[index + 1].temp.max)}°C</span>
      </div>
      </li>`;
    })
    .join("");
  forecastEl.insertAdjacentHTML("afterbegin", markup);
}
