const express = require('express');
const fetch = require('node-fetch');
const got = require('got');
const fs = require('fs');
const router = express.Router();

//Homepage
router.get('/', (req, res) => res.render('home'));



router.post('/api', async (req, res) => {
    function findDate () {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        // adjust 0 before single digit date
        const date = ("0" + today.getDate()).slice(-2);
        const tDate = ("0" + tomorrow.getDate()).slice(-2);
        // current month
        const month = ("0" + (today.getMonth() + 1)).slice(-2);
        const tMonth = ("0" + (tomorrow.getMonth() + 1)).slice(-2);
        // current year
        const year = today.getFullYear();
        const tYear = tomorrow.getFullYear();
        // current day
        const day = today.getDay();
        const tDay = tomorrow.getDay();
        return {
            today: {
                day: findDay(day),
                date: `${year}-${month}-${date}`
            },
            tomorrow: {
                day: findDay(tDay),
                date: `${tYear}-${tMonth}-${tDate}`
            }
        }
    }

    function findDay (day) {
        switch(day) {
            case 0:
                return 'Sunday';
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday';
        }
    }

    const file = fs.readFileSync('districtData.json');
    const districtData = JSON.parse(file); 

    // Data received from front-end (user's location(lat, lon))
    const data = req.body;
    let nearestDist = Number.MAX_VALUE;
    let nearestDistrict = "";
    let nearestDistrictId = "";
    function getDist(lat, lon) {
        x = Math.abs(data.lat - lat);
        y = Math.abs(data.lon - lon);
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }

    districtData.forEach((district) => {
        let dist = getDist(district.latitude, district.longitude);
        if (dist < nearestDist) {
            nearestDist = dist;
            nearestDistrict = district.name;
            nearestDistrictId = district.id;
        }
    });

    // console.log(nearestDistrict);
    // console.log(nearestDistrictId);


    // API setup
    const API_KEY = process.env.API_KEY;
    const weather = got.extend({
        prefixUrl: 'https://api.met.gov.my/v2/',
        headers: {
            'Authorization': `METToken ${API_KEY}`
        }
    });

    const endPoint = `data?datasetid=FORECAST&datacategoryid=GENERAL&locationid=${nearestDistrictId}&start_date=${findDate().today.date}&end_date=${findDate().tomorrow.date}`;

    // console.log(API_KEY);
    // console.log(endPoint);
    // console.log(findDate().today);
    // console.log(findDate().tomorrow);

    weather.get(endPoint)
        .then(response => {
            const data = JSON.parse(response.body);

            //Data to be sent to client in object
            const dataForFront = {
                location: nearestDistrict,
                date: findDate(),
                todayForecast: {
                    morning: data.results[0].value,
                    afternoon: data.results[1].value,
                    night: data.results[2].value,
                    minTemp: data.results[3].value,
                    maxTemp: data.results[4].value,
                    overall: data.results[5].value
                },
                tomorrowForecast: {
                    morning: data.results[6].value,
                    afternoon: data.results[7].value,
                    night: data.results[8].value,
                    minTemp: data.results[9].value,
                    maxTemp: data.results[10].value,
                    overall: data.results[11].value
                }
            };
            const options = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(dataForFront)
            };
            res.json(options);
            // console.log(dataForFront);
            // console.log(response);
            // const results = JSON.stringify(data.results);
            // fs.appendFile('data.json', results, () => console.log('data copied'));
        })
        .catch(err => console.error(err));

});

module.exports = router;