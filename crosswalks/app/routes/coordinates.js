// TODO: VERIFY HTTP STATUS CODES 


const express = require('express');
const app = express.Router();
const Coordinates = require('../controllers/Coordinates');
const checkAuth = require('../middleware/checkAuth');

/** 
 * List registered coordinates
 */
app.get('/', (req, res) => {

	Coordinates.list()
		.then(data => res.status(200).json(data))
		.catch(err => res.status(500).json(err));
});

app.post('/', (req, res) => {

	const coordinates = {
		latitude: req.body.latitude,
		longitude: req.body.longitude
	};


	Coordinates.add(coordinates)
		.then(data => res.status(201).json(data))
		.catch(err => res.status(500).json(err));

});

module.exports.delete = (id) =>{
	return Coordinates.destroy({
		where: {
			oid:id
		}
	})
}

module.exports = app;