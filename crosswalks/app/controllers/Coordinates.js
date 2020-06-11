const Coordinates = require('../models/Coordinates');

module.exports.list = () => {
	return Coordinates.findAll();
};

module.exports.add = async ({start, end}) => {

	await new Promise(async (resolve, reject) => {
		try {
			let returnedObj = [];
			let startCoordinate  = await Coordinates.create({
				latitude: start.latitude,
				longitude: start.longitude
			});

			let endCoordinate = await Coordinates.create({
				latitude: end.latitude,
				longitude: end.longitude
			});

			returnedObj.push(startCoordinate, endCoordinate);

			return resolve(returnedObj);
			
		} catch(e) {
			// throw e;
			return reject(e);
		}
	});

};


module.exports.getOid = (lat,long) =>{
	return Coordinates.sequelize.query("Select oid from coordinates where latitude="+lat+" and longitude="+long+";",{type: Coordinates.sequelize.QueryTypes.SELECT})
}

module.exports.delete = (id) =>{
	return Coordinates.destroy({
		where: {
			oid:id
		}
	})
}