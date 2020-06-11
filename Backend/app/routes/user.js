const express = require('express');
const app = express.Router();
const axios = require('axios');
const checkAuth = require('../middleware/checkAuth');
const Utils = require('../utils');

// Authentication
app.post('/auth', (req, res) => {

    axios.post(`${process.env.AUTH_SERVICE}/auth`, req.body)
        .then(response => res.status(response.status).json(response.data))
        .catch(err => res.status(err.response.status).json(err.response.data));
});

app.post('/register', checkAuth, (req, res) => {
    axios.post(`${process.env.AUTH_SERVICE}/register`, req.body, Utils.getHeaderWithUserToken(req))
        .then(response => res.status(response.status).json(response.data))
        .catch(err => res.status(err.response.status).json(err.response.data));
});

module.exports = app;