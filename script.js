const err = document.getElementById("err");
const box = document.getElementById("s");
const API_KEY = "ad76bc9b8c2127247851ca9e957a321e";


function getDayAndDate() {
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}


function weather() {
    const cityInput = document.getElementById("input");
    const city = cityInput.value.trim();

    if (city === "") {
        box.style.border = "2px solid red";
        err.innerText = "Please enter a city name";
        err.style.color = "red";
        return;
    } else {
        box.style.border = "none";
        err.innerText = "";
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                box.style.border = "2px solid red";
                err.innerText = "City not found";
                return;
            }

            document.getElementById("cityName").innerText = data.name;
            document.getElementById("dateDay").innerText = getDayAndDate();
            document.getElementById("temperature").innerText = `${data.main.temp} °C`;
            document.getElementById("condition").innerText = `☁️ ${data.weather[0].description}`;
            document.getElementById("humidity").innerText = `💧 Humidity: ${data.main.humidity}%`;
            document.getElementById("wind").innerText = `🌬️ Wind: ${data.wind.speed} km/h`;
        })
        .catch(() => {
            err.innerText = "Something went wrong!";
        });

    cityInput.value = "";
}


function loadCurrentLocationWeather() {
    if (!navigator.geolocation) {
        err.innerText = "Geolocation not supported";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getCityFromCoordinates(lat, lon);
        },
        () => {
            err.innerText = "Location access denied";
        }
    );
}


function getCityFromCoordinates(lat, lon) {
    const reverseGeoUrl =
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

    fetch(reverseGeoUrl)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                err.innerText = "Unable to detect city";
                return;
            }

            const cityName = data[0].name;


            document.getElementById("input").value = cityName;
            weather();
        })
        .catch(() => {
            err.innerText = "Unable to fetch location data";
        });
}


window.addEventListener("load", loadCurrentLocationWeather);


document.getElementById("input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        weather();
    }
});


