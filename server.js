if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const apiKey = process.env.apiKey 
const googleApiKey = process.env.googleApiKey
const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());
app.use(express.static('public'));
app.set('port', (process.env.PORT || 5000));

app.post('/weather', (req, res) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${req.body.latitude}&lon=${req.body.longitude}&appid=${apiKey}`
    axios({
        url: url,
        responseType: 'json'
    }).then(data => res.json(data.data))
})