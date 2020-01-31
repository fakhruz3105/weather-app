const express = require('express');
const fetch = require('node-fetch');
const got = require('got');
const router = express.Router();

//Homepage
router.get('/', (req, res) => res.render('home'));

// curl.request({
//     Authorization: "METToken a05301b687de41d4e348287fb2247e043971993e", 
//     url: "https://api.met.gov.my/v2/data?datasetid=FORECAST&datacategoryid=GENERAL&locationid=LOCATION:237&start_date=2020-01-30&end_date=2020-01-30"
// }, (err) => console.log(err));

const weather = got.extend({
    prefixUrl: 'https://api.met.gov.my/v2/',
    headers: {
        'Authorization': 'METToken a05301b687de41d4e348287fb2247e043971993e'
    }
});

let data;

weather.get('locations?locationcategoryid=DISTRICT')
    .then(response => {
        data = JSON.parse(response.body);
        console.log(data.results.length);
    })
    .catch(err => console.log(err));

//API setup
const apiKey = process.env.API_KEY;
const apiURL = 

module.exports = router;