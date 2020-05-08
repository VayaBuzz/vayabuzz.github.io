// Goals for this JavaScript
// 1) Get user's location.
// 2) Display user's location
// 3) Send user's location to openWeather API
// 4) Receive current temperature 
// 5) Display current temperature
// 6) Enable button to switch temp between F/C 
// 7) Get current time
// 8) Display current time
// 9) Fetch photo of appropriate time of day for this location.
      // tell google maps api your location,
//Nearby Search, Text Search, or Place Details request. The response to these //requests will contain a photos[] field if the place has related //photographic content.
// If there are no photos, revert to a stock image for the weather.
// If there are photos, pass the photoID to google to retrieve the image, 
// and set it as your background.
      // nearby places.
// 10) Display photo in background
// 11) Bonus: Refresh time in real time.
// 12) Bonus: Refresh temperature and background photo every 1 minute.
/** NOTE: uses jQuery for quick & easy DOM manipulation **/



var wuKey = "ecc303b65d4d2261";
var openWeatherKey = "a5d162ffa0416a14238eb36a68834cf0";
var tempUnit = "F";// "°F";
var weatherTempC, weatherTempF;


//
// getWeather()   Will fetch the current weather conditions for lat,lng parameters
//                Some JSON request code inspired by 
//                https://github.com/google/maps-for-work-samples/blob/master/samples/maps/OpenWeatherMapLayer/index.html
// 
function getWeather(lat, lng) {
  //console.log("Entering getWeather()...");
  //console.log("   lat,lng: " + lat + "," + lng);

  //var requestString5 = "https://api.wunderground.com/api/ecc303b65d4d2261/conditions/q/37.776289,-122.395234.json";
  //var requestString6 = "https://api.wunderground.com/api/" + wuKey + "/conditions/q/" + lat + "," + lng + ".json";
  var requestString7t =     "https://api.openweathermap.org/data/2.5/weather?q=Seattle&units=imperial&appid=ab85ba57bbbb423fb62bfb8201126ede";
  // this works with his key:
  var requestString7 = "https://api.openweathermap.org/data/2.5/weather?lat=39&lon=139&units=imperial&appid=ab85ba57bbbb423fb62bfb8201126ede";// " + openWeatherKey;
  // now try again with my key
  requestString7 = "https://api.openweathermap.org/data/2.5/weather?lat=39&lon=139&units=imperial&appid=" + openWeatherKey;  
  // now try again with local coords and my key:
  requestString7 = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=imperial&appid=" + openWeatherKey;  
  // try again with both c and f results:
  requestString7 = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=imperial&units=metric&appid=" + openWeatherKey;  

  console.log("requestString7: " + requestString7);
  request = new XMLHttpRequest();
  request.onload = proccessResults;
  request.open("get", requestString7, true);
  request.send();
  //console.log("sent request. Await reply...");
}
// Take the JSON results and proccess them
function proccessResults() {
  //console.log("Entering processResults...");
  //console.log(this);
  var results = JSON.parse(this.responseText);
  console.log("Results: ");
  console.log(results);
  //console.log(results.current_observation.display_location);
  weatherTempF = Math.round(results.main.temp);
  weatherTempC = Math.round((weatherTempF - 32) * 5/9);
  var weatherIconURL = "http://openweathermap.org/img/w/" + results.weather[0].icon + ".png";
  console.log(weatherIconURL);
  var weatherCity = results.name;

  var weatherConditions = results.weather[0].description;
  //console.log("Current Observation: ");
  //console.log(results.current_observation);
  //console.log("Temp F: " + weatherTempF);
  //console.log("Temp C: " + weatherTempC);
  //console.log("City: " + weatherCity);
  //console.log("WeatherIconURL: " + weatherIconURL);
  outputWeather(weatherCity, weatherTempF, weatherIconURL, weatherConditions);
}

  var outputWeather = function(city, temp, weatherIconURL, weatherConditions) {
    //console.log("Entering outputWeather...");
    $('.cityText').text(city);
    $('.temperatureText').text(temp + " ");
    $('.tempUnitsTest').text(String.fromCharCode(176) + tempUnit);
    $('.weatherConditions').text(weatherConditions + "!");
    document.getElementById("myImg").src = weatherIconURL; //"http://icons.wxug.com/i/c/k/cloudy.gif";// weatherIconURL;
  };

//
// geoFindMe()  
// Determines the current location (lat/lng) of browser.
// most code courtesy of: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
//
function geoFindMe() {
  //console.log('entering geoFindMe()...');
  var output = document.getElementById("out");

  if (!navigator.geolocation) {
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    getWeather(latitude, longitude);
  } // end success()

  function error() {
    output.innerHTML = "Unable to retrieve your location. Please enable My Location.";
  } // end error()

  //output.innerHTML = "<p>Locating…</p>";

  var options = {
    // enableHighAccuracy = true:  extra time or power to return a really accurate result.
    //                      false: quick (but less accurate) answer.
    // timeout = how long does the device have, in milliseconds to return a result.
    // maximumAge = maximum age for possible previously-cached position. 
    //              0 = must return the current position, not a prior cached position.
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };
  navigator.geolocation.getCurrentPosition(success, error, options);
} // end function geoFindMe() 

$('.tempUnitsTest').on('click', function() {
  //console.log("Current Temp Unit: " + tempUnit);
  if (tempUnit == "F"){
    tempUnit = "C";
    $('.temperatureText').text(weatherTempC + " ");
  }
  else{
    tempUnit = "F";
    $('.temperatureText').text(weatherTempF + " ");
  }
  $('.tempUnitsTest').text(String.fromCharCode(176) + tempUnit);
});

// Detect if it's nighttime. If so, switch
// to a darker themed CSS
// Rudimentary for Northern Hemisphere for now.
function dayOrNightCSS(){
    var d = new Date();
    var n = d.getHours();
    //console.log('hour: ' + d);
    if (n < 7 || n >= 19){
      changeColour();
    }
}
// changes CSS used by body to alternate "night" mode
function changeColour() {
    var myDiv = document.getElementById('myID');
    myDiv.className = 'myId-alternate';
}
// not used at this time, but opposite of changeColour!
function resetColour() {
    var myDiv = document.getElementById('myID');
    myDiv.className = 'myId-normal';
}

$(document).ready(function() {
  //console.log("ready!");
  dayOrNightCSS();
  geoFindMe();
});