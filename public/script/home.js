let lat, lon;

if ('geolocation' in navigator) {
    console.log('Geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        getWeather(lat, lon);      
    }, error => {
        if(error.message === 'User denied Geolocation') {
            lat = 3.139003;
            lon = 101.686855;
            getWeather(lat, lon);
            document.getElementById('error').textContent = 'Please enable your location for local weather forecast';
            document.getElementById('defLocation').textContent = '(Location is set to default)';
        }
    });
} else {
    console.log('Geolocation unavailable');
    lat = 3.139003;
    lon = 101.686855;
    getWeather(lat, lon);
    document.getElementById('error').textContent = 'Location is unavailable';
    document.getElementById('defLocation').textContent = '(Location is set to default)';
}

async function getWeather(lat, lon) {
    const data = { lat, lon };
    document.getElementById('latitude').textContent = lat;
    document.getElementById('longitude').textContent = lon;

    const options = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const res = await fetch('/api', options);
    const json = await res.json();
    const weather = JSON.parse(json.body);

    // console.log(weather);

    //Today
    document.getElementById('location').textContent = weather.location;
    document.getElementById("dateToday").textContent = weather.date.today.date;
    document.getElementById("dayToday").textContent = weather.date.today.day;
    document.getElementById("overallToday").textContent = weather.todayForecast.overall;
    document.getElementById("morningToday").textContent = weather.todayForecast.morning;
    document.getElementById("afternoonToday").textContent = weather.todayForecast.afternoon;
    document.getElementById("nightToday").textContent = weather.todayForecast.night;
    document.getElementById("minToday").textContent = weather.todayForecast.minTemp;
    document.getElementById("maxToday").textContent = weather.todayForecast.maxTemp;

    //Tomorrow
    document.getElementById("dateTomorrow").textContent = weather.date.tomorrow.date;
    document.getElementById("dayTomorrow").textContent = weather.date.tomorrow.day;
    document.getElementById("overallTomorrow").textContent = weather.tomorrowForecast.overall;
    document.getElementById("morningTomorrow").textContent = weather.tomorrowForecast.morning;
    document.getElementById("afternoonTomorrow").textContent = weather.tomorrowForecast.afternoon;
    document.getElementById("nightTomorrow").textContent = weather.tomorrowForecast.night;
    document.getElementById("minTomorrow").textContent = weather.tomorrowForecast.minTemp;
    document.getElementById("maxTomorrow").textContent = weather.tomorrowForecast.maxTemp;

    //Icon today
    const overallToday = weather.todayForecast.overall;
    // console.log (overallToday );
    
    if (overallToday === "No rain") {
        document.getElementById("iconToday").src = 'image/sunny.png';
    } else if (overallToday.match(/cloud/i)) {
        document.getElementById("iconToday").src = 'image/cloudy.png';
    } else if (overallToday.match(/thunder/i)) {
        document.getElementById("iconToday").src = 'image/thunderstorm.png';
    } else if (overallToday.match(/rain/i)) {
        document.getElementById("iconToday").src = 'image/rainy.png';
    } else if (overallToday.match(/wind/i)) {
        document.getElementById("iconToday").src = 'image/windy.png';
    }


    
    //Icon tomorrow
    const overallTomorrow = weather.tomorrowForecast.overall;
    // console.log (overallTomorrow === "No rain");

    if (overallTomorrow === "No rain") {
        document.getElementById("iconTomorrow").src = 'image/sunny.png';
    } else if (overallTomorrow.match(/cloud/i)) {
        document.getElementById("iconTomorrow").src = 'image/cloudy.png';
    } else if (overallTomorrow.match(/thunder/i)) {
        document.getElementById("iconTomorrow").src = 'image/thunderstorm.png';
    } else if (overallTomorrow.match(/rain/i)) {
        document.getElementById("iconTomorrow").src = 'image/rainy.png';
    } else if (overallTomorrow.match(/wind/i)) {
        document.getElementById("iconTomorrow").src = 'image/windy.png';
    }

    
}