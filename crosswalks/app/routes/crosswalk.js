const express = require('express');
const app = express.Router();
const Crosswalks = require('../controllers/Crosswalks');
const Coordinates = require('../controllers/Coordinates');
const checkAuth = require('../middleware/checkAuth');

/**
 * Lists all crosswalks
 */
app.get('/', (req, res) => {

	Crosswalks.list()
		.then(data => res.status(200).json(data))
		//.then(data => console.log(data))
		.catch(err => res.status(500).json(err));
});

/**
 * Creates a new Crosswalk
 */
app.post('/', checkAuth, async (req, res) => {
//app.post('/', async (req, res) => {
	let oidStart;
	let oidEnd;

	let coordinates = {
		start: {
			longitude: req.body.startLongitude,
			latitude: req.body.startLatitude
		},
		end: {
			longitude: req.body.endLongitude,
			latitude: req.body.endLatitude
		}
	};
	await Coordinates.add(coordinates);

	await Coordinates.getOid(req.body.startLatitude,req.body.startLongitude)
		.then(data => {
				oidStart=data[0].oid
			})
		.catch(error => res.json(error));

	await Coordinates.getOid(req.body.endLatitude,req.body.endLongitude)
		.then(data => {
				oidEnd=data[0].oid
			})
		.catch(error => res.json(error));

	let oids = {
		coordinateBegin: oidStart,
		coordinateEnd: oidEnd
	};

	await Crosswalks.add(oids)
		.then(data => res.status(201).json(data))
		.catch(err => res.status(500).json(err));
		
	
});

/**
 * Increments the number of pedestrians in a crosswalk
 */
app.post('/pedestrians/incr/:crossId', async(req, res)=> {
	Crosswalks.incrPedestrians(req.params.crossId)
		.then(cross => res.jsonp(cross))
		.catch(err => res.status(500).jsonp(err))
})


/**
 * Decreases the number of pedestrians in a crosswalk
 */
app.post('/pedestrians/decr/:crossId', async(req, res)=> {
	Crosswalks.decrPedestrians(req.params.crossId)
		.then(cross => res.jsonp(cross))
		.catch(err => res.status(500).jsonp(err))
})

/**
 * Increments the number of cars in a crosswalk
 */

/**
 * Decreases the number of cars in a crosswalk
 */

/**
 * Delete a Crosswalk
 */
app.delete('/:id', checkAuth, (req, res) => {

	let id = req.params.id;

	console.log(`ID: ${id}`);

	let result = Crosswalks.deleteCrosswalk(id);

	if(result) {
		res.status(201).json({title: "Deleted", message: `Crosswalk with id ${id} has been deleted`});
	} else {
		res.status(500).json({title: "Error Deleting", message: `There has been an error deleting crosswalk with ID ${id}`});
	}

});



/**
 * Update a Crosswalk
 */
app.put('/:id', checkAuth, (req, res) => {
	res.status(501);
});

/**
 * Get a single Crosswalk
 */
app.get('/:id', checkAuth, (req, res) => {
	const id = req.params.id;

	Crosswalks.searchById(id)
		.then(data => res.json(data))
		.catch(err => res.status(500).json(err));
});


module.exports = app;