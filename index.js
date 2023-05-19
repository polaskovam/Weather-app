"use strict";

let city = "Prague";
let city2 = "Brno";

const cities = [];

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
    let cityInput = document.getElementById("cityInput");
    let search = document.getElementById("btn-search");

    search.addEventListener("click", function () {
        city = cityInput.value;
        sendRequest(city);
        cityInput.value = '';
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            city = cityInput.value;
            sendRequest(city);
            cityInput.value = '';
        }
    });
});

// Update city information
function updateCities() {
    // new first city
    const weekDay1 = document.getElementById("day-1");
    const date1 = document.getElementById("date-1");
    const town1 = document.getElementById("town-1");
    const temp1 = document.getElementById("temp-1");
    const wordTemp1 = document.getElementById("word-temp-1");
    const precipitation1 = document.getElementById("precipitation-1");
    const humidity1 = document.getElementById("humidity-1");
    const wind1 = document.getElementById("wind-1");
    const nextDay1 = document.getElementById("next-day-1");
    const nextDayTemp1 = document.getElementById("next-day-temp-1");
    const nextDay2 = document.getElementById("next-day-2");
    const nextDayTemp2 = document.getElementById("next-day-temp-2");
    const nextDay3 = document.getElementById("next-day-3");
    const nextDayTemp3 = document.getElementById("next-day-temp-3");

    weekDay1.innerHTML = cities[0].weekDay;
    date1.innerHTML = cities[0].date;
    town1.innerHTML = cities[0].name;
    temp1.innerHTML = `${cities[0].currentTemp} °C`;
    wordTemp1.innerHTML = cities[0].description;
    precipitation1.innerHTML = `${cities[0].precipitation} %`;
    humidity1.innerHTML = `${cities[0].humidity} %`;
    wind1.innerHTML = `${cities[0].wind} km/h`;
    nextDay1.innerHTML = cities[0].forecast1.weekDay;
    nextDayTemp1.innerHTML = `${cities[0].forecast1.temp} °C`;
    nextDay2.innerHTML = cities[0].forecast2.weekDay;
    nextDayTemp2.innerHTML = `${cities[0].forecast2.temp} °C`;
    nextDay3.innerHTML = cities[0].forecast3.weekDay;
    nextDayTemp3.innerHTML = `${cities[0].forecast3.temp} °C`;

    // second city
    const weekDay2 = document.getElementById("day-2");
    const date2 = document.getElementById("date-2");
    const town2 = document.getElementById("town-2");
    const temp2 = document.getElementById("temp-2");
    const wordTemp2 = document.getElementById("word-temp-2");
    const precipitation2 = document.getElementById("precipitation-2");
    const humidity2 = document.getElementById("humidity-2");
    const wind2 = document.getElementById("wind-2");
    const nextDay4 = document.getElementById("next-day-4");
    const nextDayTemp4 = document.getElementById("next-day-temp-4");
    const nextDay5 = document.getElementById("next-day-5");
    const nextDayTemp5 = document.getElementById("next-day-temp-5");
    const nextDay6 = document.getElementById("next-day-6");
    const nextDayTemp6 = document.getElementById("next-day-temp-6");

    // shift first city to second place
    weekDay2.innerHTML = cities[1].weekDay;
    date2.innerHTML = cities[1].date;
    town2.innerHTML = cities[1].name;
    temp2.innerHTML = `${cities[1].currentTemp} °C`;
    wordTemp2.innerHTML = cities[1].description;
    precipitation2.innerHTML = `${cities[1].precipitation} %`;
    humidity2.innerHTML = `${cities[1].humidity} %`;
    wind2.innerHTML = `${cities[1].wind} km/h`;
    nextDay4.innerHTML = cities[1].forecast1.weekDay;
    nextDayTemp4.innerHTML = `${cities[1].forecast1.temp} °C`;
    nextDay5.innerHTML = cities[1].forecast2.weekDay;
    nextDayTemp5.innerHTML = `${cities[1].forecast2.temp} °C`;
    nextDay6.innerHTML = cities[1].forecast3.weekDay;
    nextDayTemp6.innerHTML = `${cities[1].forecast3.temp} °C`;
}

// Function containing fetch to get icon code
function getImage() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // variables for locating image code
            const imageCodes = {};
            const findObjects = {};
            const weatherCodes = {};

            for (let i = 1; i <= 8; i++) {
                if (i === 1) {
                    weatherCodes[`weatherCode${i}`] = cities[0].weatherCode;
                } else if (i < 5) {
                    weatherCodes[`weatherCode${i}`] = cities[0][`forecast${i - 1}`].weatherCode;
                } else if (i === 5) {
                    weatherCodes[`weatherCode${i}`] = cities[1].weatherCode;
                } else {
                    weatherCodes[`weatherCode${i}`] = cities[1][`forecast${i - 5}`].weatherCode;
                }
                findObjects[`findObject${i}`] = data.find(obj => obj.code === weatherCodes[`weatherCode${i}`]);

                if (findObjects[`findObject${i}`]) {
                    imageCodes[`imageCode${i}`] = findObjects[`findObject${i}`].icon;
                    document.getElementById(`icon${i}`).src = `images/${imageCodes[`imageCode${i}`]}.png`
                }

            }

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

}

// Function for all weather searches but initial
function sendRequest(name) {
    const api1 = `http://api.weatherapi.com/v1/forecast.json?key=7dc87565cc6c4d1abfb210447230704&q=${name}&days=3&aqi=no&alerts=no`;

    fetch(api1)
        .then(response => {
            return response.json();
        })
        .then(data => {

            const newCity = {
                weekDay: new Date(data.location.localtime_epoch * 1000).toLocaleString('en-US', {weekday: 'long'}),
                date: new Date(data.location.localtime_epoch * 1000).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).split('/').join('.'),
                name: data.location.name,
                currentTemp: data.current.temp_c,
                weatherCode: data.current.condition.code,
                description: data.current.condition.text,
                precipitation: data.current.precip_mm,
                humidity: data.current.humidity,
                wind: Math.round(data.current.wind_kph),
                forecast1: {
                    weekDay: new Date(data.forecast.forecastday[0].date_epoch * 1000).toLocaleString('en-US', {weekday: 'short'}),
                    weather: data.forecast.forecastday[0].day.condition.text,
                    weatherCode: data.forecast.forecastday[0].day.condition.code,
                    temp: Math.round(data.forecast.forecastday[0].day.avgtemp_c),
                },
                forecast2: {
                    weekDay: new Date(data.forecast.forecastday[1].date_epoch * 1000).toLocaleString('en-US', {weekday: 'short'}),
                    weather: data.forecast.forecastday[1].day.condition.text,
                    weatherCode: data.forecast.forecastday[1].day.condition.code,
                    temp: Math.round(data.forecast.forecastday[1].day.avgtemp_c),
                },
                forecast3: {
                    weekDay: new Date(data.forecast.forecastday[2].date_epoch * 1000).toLocaleString('en-US', {weekday: 'short'}),
                    weather: data.forecast.forecastday[2].day.condition.text,
                    weatherCode: data.forecast.forecastday[2].day.condition.code,
                    temp: Math.round(data.forecast.forecastday[2].day.avgtemp_c),
                }
            }
            cities.unshift(newCity);
            updateCities();
            cities.pop();
            getImage();

        })
        .catch(error => {
            alert("Enter valid location name!");
            console.error('Error fetching data:', error);
        });
}

// initial API request
function sendInitialRequest(name, name2) {
    const api1 = `http://api.weatherapi.com/v1/forecast.json?key=7dc87565cc6c4d1abfb210447230704&q=${name}&days=3&aqi=no&alerts=no`;
    const api2 = `http://api.weatherapi.com/v1/forecast.json?key=7dc87565cc6c4d1abfb210447230704&q=${name2}&days=3&aqi=no&alerts=no`;

    // Fetch for first city
    fetch(api1)
        .then(response => {
            return response.json();
        })
        .then(data => {

            const firstCity = {
                weekDay: new Date(data.location.localtime_epoch * 1000).toLocaleString('en-US', {weekday: 'long'}),
                date: new Date(data.location.localtime_epoch * 1000).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).split('/').join('.'),
                name: data.location.name,
                currentTemp: data.current.temp_c,
                description: data.current.condition.text,
                weatherCode: data.current.condition.code,
                precipitation: data.current.precip_mm,
                humidity: data.current.humidity,
                wind: Math.round(data.current.wind_kph),
                forecast1: {
                    weekDay: new Date(data.forecast.forecastday[0].date_epoch * 1000).toLocaleString('en-US', {weekday: 'short'}),
                    weather: data.forecast.forecastday[0].day.condition.text,
                    weatherCode: data.forecast.forecastday[0].day.condition.code,
                    temp: Math.round(data.forecast.forecastday[0].day.avgtemp_c),
                },
                forecast2: {
                    weekDay: new Date(data.forecast.forecastday[1].date_epoch * 1000).toLocaleString('en-US', {weekday: 'short'}),
                    weather: data.forecast.forecastday[1].day.condition.text,
                    weatherCode: data.forecast.forecastday[1].day.condition.code,
                    temp: Math.round(data.forecast.forecastday[1].day.avgtemp_c),
                },
                forecast3: {
                    weekDay: new Date(data.forecast.forecastday[2].date_epoch * 1000).toLocaleString('en-US', {weekday: 'short'}),
                    weather: data.forecast.forecastday[2].day.condition.text,
                    weatherCode: data.forecast.forecastday[2].day.condition.code,
                    temp: Math.round(data.forecast.forecastday[2].day.avgtemp_c),
                }

            }
            cities.push(firstCity);
            console.log(cities[0]);

            // Fetch for second city
            fetch(api2)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const secondCity = {
                        weekDay: new Date(data.location.localtime_epoch * 1000).toLocaleString('en-US', {weekday: 'long'}),
                        date: new Date(data.location.localtime_epoch * 1000).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        }).split('/').join('.'),
                        name: data.location.name,
                        currentTemp: data.current.temp_c,
                        description: data.current.condition.text,
                        weatherCode: data.current.condition.code,
                        precipitation: data.current.precip_mm,
                        humidity: data.current.humidity,
                        wind: Math.round(data.current.wind_kph),
                        forecast1: {
                            weekDay: new Date(data.forecast.forecastday[0].date_epoch * 1000).toLocaleString('en-US', {weekday: 'short'}),
                            weather: data.forecast.forecastday[0].day.condition.text,
                            weatherCode: data.forecast.forecastday[0].day.condition.code,
                            temp: Math.round(data.forecast.forecastday[0].day.avgtemp_c),
                        },
                        forecast2: {
                            weekDay: new Date(data.forecast.forecastday[1].date_epoch * 1000).toLocaleString('en-US', {weekday: 'short'}),
                            weather: data.forecast.forecastday[1].day.condition.text,
                            weatherCode: data.forecast.forecastday[1].day.condition.code,
                            temp: Math.round(data.forecast.forecastday[1].day.avgtemp_c),
                        },
                        forecast3: {
                            weekDay: new Date(data.forecast.forecastday[2].date_epoch * 1000).toLocaleString('en-US', {weekday: 'short'}),
                            weather: data.forecast.forecastday[2].day.condition.text,
                            weatherCode: data.forecast.forecastday[2].day.condition.code,
                            temp: Math.round(data.forecast.forecastday[2].day.avgtemp_c),
                        }
                    }
                    cities.push(secondCity);

                    updateCities();
                    getImage();

                })
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));

}

// Calling initial function
sendInitialRequest(city, city2);
