// TODO: VERIFY HTTP STATUS CODES 

const axios = require('axios');
const express = require('express');
const app = express.Router();
const checkAuth = require('../middleware/checkAuth');

/** 
 * List registered coordinates
 */
app.get('/', (req, res) => {

    axios.get(`${process.env.CROSSWALK_SERVICE}/coordinates`)
        .then(response => res.status(response.status).json(response.data))
        .catch(err => res.status(err.response.status).jsonp(err.response.data));
});

app.post('/', checkAuth, (req, res) => {

    axios.post(`${process.env.CROSSWALK_SERVICE}/coordinates`, req.body, getHeaderWithUserToken(req))
        .then(response => res.status(response.status).json(response.data))
        .catch(err => res.status(err.response.status).json(err.response.data));
});

function getHeaderWithUserToken(req){
    return { headers: {
            userToken: req.headers.usertoken
        }}
}

module.exports = app;