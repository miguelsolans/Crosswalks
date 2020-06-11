const Coordinates = require('../controllers/Coordinates');
const Cars = require('../controllers/Cars');
const Pedestrians = require('../controllers/Pedestrians');

async function filterCrosswalksByRange(range, closeRange, coords){
    let crosswalks = JSON.parse(await Coordinates.getCrosswalks());
    let res = {longRange: [], notInRange: [], closeRange: []}
    for(let cw of crosswalks){
        let dist = getDistanceFromLatLon(coords.latitude,
            coords.longitude,cw.LatS,cw.LongS);
        if(dist < closeRange)
            res.closeRange.push(cw);
        else if(dist < range)
            res.longRange.push(cw);
        else
            res.notInRange.push(cw);
    }
    return res;
}

function getIdWithCoords(req){
    let body = {
        id : req.id,
        coordinates : req.coordinates,
    };

    return body;
}

function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1);
    let a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d * 1000;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}


module.exports = {
    filterCrosswalksByRange,
    getIdWithCoords,
    getDistanceFromLatLon,
    deg2rad
};