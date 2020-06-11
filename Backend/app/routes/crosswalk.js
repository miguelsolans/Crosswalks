const express = require('express');
const app = express.Router();
const checkAuth = require('../middleware/checkAuth');
const axios = require('axios');
const Utils = require('../utils');

/**
 * Lists all crosswalks
 */
app.get('/', (req, res) => {

	axios.get(`${process.env.CROSSWALK_SERVICE}/crosswalk`)
		.then(response => {
			res.status(response.status).json(response.data)
		})
		.catch(err => {
			console.log(err);
			//res.json(err.response.data)
		});
});

/**
 * Creates a new Crosswalk
 */
app.post('/', checkAuth, (req, res) => {
	//app.post('/', (req, res) => {
	// console.log("HEADERS " + JSON.stringify(req.headers))
	axios.post(`${process.env.CROSSWALK_SERVICE}/crosswalk`, req.body, getHeaderWithUserToken(req))
		.then(response => {
			console.log(response);
			res.status(response.status).json(response.data)
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err.response)
		});
});

/**
 * Update a Crosswalk
 */
app.put('/:id', checkAuth, (req, res) => {

	axios.put(`${process.env.CROSSWALK_SERVICE}/crosswalk/${req.params.id}`, req.body, getHeaderWithUserToken(req))
		.then(response => res.status(response.status).json(response.data))
		.catch(err => res.status(err.response.status).json(err.response.data));
});

/**
 * Get a single Crosswalk
 */
app.get('/:id', (req, res) => {
	axios.get(`${process.env.CROSSWALK_SERVICE}/crosswalk/${req.params.id}`)
		.then(response => res.status(response.status).json(response.data))
		.catch(err => res.status(err.response.status).json(err.response.data));
});

/**
 * Delete a Crosswalk by a given ID
 */
app.delete('/:id', checkAuth, (req, res) => {
	axios.delete(`${process.env.CROSSWALK_SERVICE}/crosswalk/${req.params.id}`, getHeaderWithUserToken(req))
		.then(response => res.status(response.status).json(response.data))
		.catch(err => res.status(500).json(err));
});

// TODO: replace this with utils
function getHeaderWithUserToken(req){
	return { headers: {
			userToken: req.headers.usertoken || req.headers.userToken
	}}
}

module.exports = app;