const Crosswalks = require('../models/Crosswalk');
const Coordinates = require('../controllers/Coordinates');

module.exports.list = () => {
	return Crosswalks.sequelize.query("select crosswalk.oid,state,cars,pedestrians,CC.latitude as LatS,CC.longitude as LongS,C.latitude as LatE,C.Longitude as LongE from crosswalk join coordinates as CC on CC.oid=crosswalk.coordinates_oid join coordinates as C on C.oid=crosswalk.coordinates_oid_2;",{type: Crosswalks.sequelize.QueryTypes.SELECT});
};

module.exports.add = ({coordinateBegin, coordinateEnd}) => {
	const newCrosswalk = {
		coordinates_oid: coordinateBegin,
		coordinates_oid_2: coordinateEnd
	};

	return Crosswalks.create(newCrosswalk);
};


module.exports.searchById = (id) => {
	return Crosswalks.find({
		where: {
			oid: id
		}
	})
};

module.exports.incrPedestrians = async (id) => {
	let cross = await getCrosswalk(id);
	console.log("get cross: " + JSON.stringify(cross));
	if(cross){
		console.log("Crosswalk: " + JSON.stringify(cross));
		await Crosswalks.sequelize.query("update crosswalk set pedestrians=" + (cross.pedestrians +1) + " where oid=" + id, {type: Crosswalks.sequelize.QueryTypes.UPDATE})
		return await getCrosswalk(id)
	} else {
		return null;
	}
};

module.exports.decrPedestrians = async (id) => {
	let cross = await getCrosswalk(id);
	console.log("get cross: " + JSON.stringify(cross));
	if(cross){
		console.log("Crosswalk: " + JSON.stringify(cross));
		await Crosswalks.sequelize.query("update crosswalk set pedestrians=" + (cross.pedestrians -1) + " where oid=" + id, {type: Crosswalks.sequelize.QueryTypes.UPDATE})
		return await getCrosswalk(id)
	} else {
		return null;
	}
}

async function getCrosswalk(id){
	let cross = await Crosswalks.sequelize.query("select crosswalk.oid,state,cars,pedestrians,CC.latitude as LatS,CC.longitude as LongS,C.latitude as LatE,C.Longitude as LongE from crosswalk join coordinates as CC on CC.oid=crosswalk.coordinates_oid join coordinates as C on C.oid=crosswalk.coordinates_oid_2 where crosswalk.oid= " + id + ";")
	console.log(JSON.stringify(cross))
	if(cross.length > 0){
		return cross[0][0]
	}
	return null;
}

module.exports.delete = (id) =>{
		return Crosswalks.destroy({
		where: {
			oid:id
		}
	})
	
}

module.exports.getCOids = (id) =>{
	
	return Crosswalks.sequelize.query("Select coordinates_oid,coordinates_oid_2 from crosswalk where oid="+id+";",{type: Crosswalks.sequelize.QueryTypes.SELECT})
}


module.exports.deleteCrosswalk = async (id) => {
	// Obter os IDS das coordenadas

	let coordinatesIds = await this.getCOids(id);

	// Eliminar a Crosswalk
	let destroyResult = await Crosswalks.destroy({
		where: {
			oid: id
		}
	});

	if(coordinatesIds.length > 0 && destroyResult > 0) {

		// coordinatesIds[0].coordinates_id coordinates_oid_2
		let r1 = await Coordinates.delete(coordinatesIds[0].coordinates_oid);
		let r2 = await Coordinates.delete(coordinatesIds[0].coordinates_oid_2);
		// Crosswalk apagada
		return true
	}

	return false;
};