const redisConn = require('./redis-connection').getConnection()
const { promisify } = require("util");
const Coordinates = require("./Coordinates")

const get = promisify(redisConn.get).bind(redisConn)
const set = promisify(redisConn.set).bind(redisConn)
const addSet = promisify(redisConn.sadd).bind(redisConn)
const getSet = promisify(redisConn.smembers).bind(redisConn)
const removeSet = promisify(redisConn.srem).bind(redisConn)

module.exports.addPedestrian = async ({id, coordinates}) => {
    await addSet("pedestrians",JSON.stringify({id, coordinates}));
    return setter({id: 'p'+id, coordinates});
};

module.exports.getPedestrian = (id) => {
    return getter('p'+id);
};

module.exports.addPedestrianToCrossWalk = async (idPedestrian, idCrosswalk) =>{
    await addSet("pedestriansInCross" + idCrosswalk, JSON.stringify(idPedestrian))
    let pedestriansNearCross = await getSet("pedestriansInCross" + idCrosswalk).then(data => {
        return JSON.parse("["+data+"]")
    })
    return pedestriansNearCross;
}


module.exports.getPedestiansInCrosswalk = async (idCrosswalk) => {
    return getSet("pedestriansInCross" + idCrosswalk).then(data => {
        return JSON.parse("["+data+"]")
    })
}

module.exports.removePedestrianFromCrossWalk = async (idPedestrian, idCrosswalk) => {
    await removeSet("pedestriansInCross" + idCrosswalk, JSON.stringify(idPedestrian))
    let pedestriansNearCross = await getSet("pedestriansInCross" + idCrosswalk).then(data => {
        return JSON.parse("["+data+"]")
    })
    return pedestriansNearCross;
}

module.exports.getPedestrians = () => {
    return getSet("pedestrians").then(data => {
        return JSON.parse("[" + data + "]")
    })
}

module.exports.setPedestrianState = async (idPed, state) => {
    await set("carsState" + idPed, state);
    return state
}

module.exports.getPedestrianState = async (idPed) => {
    return get("carsState" + idPed)
}

module.exports.cleanPedestrian = async (idPed) => {
    await removeSet("pedsState", idPed)
    let crosswalks = JSON.parse(await Coordinates.getCrosswalks());
    console.log("crosswalks: " + crosswalks)
    for(let cross of crosswalks) {
        await removeSet("pedestriansInCross" + cross.oid, idPed)
    }
}

function getter(id){
    return get(id).then(JSON.parse).then(data => {data.id = data.id.substring(1); return data})
}

function setter(object) {
    return set(object.id, JSON.stringify(object))
}
