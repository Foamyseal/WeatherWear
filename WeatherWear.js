//set Constants

const iconElement = document.querySelector(".weather-icon")
const tempElement = document.querySelector(".temperature-value")
const descElement = document.querySelector(".temperature-description")
const locationElement = document.querySelector(".location")
const notificationElement = document.querySelector(".notification")
const clothingElement = document.querySelector(".clothing")
const weather = {};
weather.temperature = {
    unit:"celsius"
}
const KELVIN = 273;
const apiKey = "ab4c9fe36cd628a8a8c4a8fa407ab996";

// Get Current Location

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, displayError);
}
else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = '<p> Geolocation not Supported </p>'
}

function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

function displayError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = '<p> ${error.message} </p>'
}

// Retreive data from OpenWeather API

function getWeather(latitude,longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    console.log(api);

    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        weather.temperature.value = Math.round(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(function(){
        whatToWear();
    })
    .then(function(){
        displayWeather();
        
    });
}

function whatToWear(){
    if (weather.temperature.value< 10){
        text = "Wear a Parka!"
    } else if (weather.temperature.value > 10 && weather.temperature.value < 20){
        text = "Wear a Jacket!"
    } else {
        text = "No need for a Jacket today :)"
    }
}
//Display Weather on Screen 

function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" />`;
    tempElement.innerHTML = `${weather.temperature.value} °<span>C</span></p>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    clothingElement.innerHTML = text;
}

//Function to determine what to wear based on the following conditions 
// if speed > 2.0 -> add wind jacket 
// if clear sky -> suggest 
//if main.feels_like > 12 celsius -> coat, >8 -> parka 
//if wind.speed > 10 windbreaker
//rain.1h > 0 -> it was raining a bit ago, you might want to bring an umbrella