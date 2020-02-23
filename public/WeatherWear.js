 //set Constants
const iconElement = document.querySelector(".weather-icon")
const tempElement = document.querySelector(".temperature-value")
const descElement = document.querySelector(".temperature-description")
const locationElement = document.querySelector(".location")
const notificationElement = document.querySelector(".notification")
const clothingElement = document.querySelector(".clothing")
const searchElement = document.querySelector('[data-city-search]')
const weather = {};
weather.temperature = {
    unit:"celsius"
}
const KELVIN = 273;

// Main Method -> Fetch Loation API and then Set it to Data
const searchBox = new google.maps.places.SearchBox(searchElement)
searchBox.addListener('places_changed', () => {
    const place = searchBox.getPlaces()[0]
    if (place == null) return
    const latitude = place.geometry.location.lat()
    const longitude = place.geometry.location.lng()
    fetch('/weather', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
        })
    }).then(res => res.json()).then(data => {
        console.log(data)
        setWeatherData(data)
    }).then(function(){
        whatToWear();
    }).then(function(){
        displayWeatherData();
    })
})

//calculate weatherData
function setWeatherData(data){
    weather.temperature.value = Math.round(data.main.temp - KELVIN);
    weather.description = data.weather[0].description;
    weather.iconId = data.weather[0].icon;
    weather.type = data.weather[0].main;
    //console.log(data)
}

//determine what user should wear based on weather.type
function whatToWear(){

    if (weather.temperature.value <= 5 || ("Snow" == weather.type)){
        text = "You should wear a Parka!";
    } else if ("Rain" == weather.type) {
        text = "You should wear a rain coat!";
    } else if ("Thunderstorm" == weather.type){
        text = "You should probably not go outside...";
    } else if ("Drizzle" == weather.type) {
        text = "You should probably wear a light rain jacket!"; 
    } else if (weather.temperature.value > 20) {
        text = "You don't need a jacket when you go out!";
    } else if (weather.temperature.value < 10) {
        text = "you should wear a jacket cause its cold"
    } else {
        text = "You should bring a jacket just in case"
    }
} 

//display results 
function displayWeatherData(){
    iconElement.innerHTML=  "<img src= http://openweathermap.org/img/w/" + weather.iconId + ".png>";
    tempElement.textContent = `${weather.temperature.value} ° C`;
    descElement.textContent = weather.description;
    clothingElement.textContent = text;
}


//Function to determine what to wear based on the following conditions 
// if speed > 2.0 -> add wind jacket 
// if clear sky -> suggest 
// if not clear sky -> suggest umbrella 
//if main.feels_like > 12 celsius -> coat, >8 -> parka 
//if wind.speed > 10 windbreaker
//rain.1h > 0 -> it was raining a bit ago, you might want to bring an 
// should probably do like