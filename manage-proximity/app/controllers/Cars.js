const redisConn = require('./redis-connection').getConnection()
const { promisify } = require("util");
const Coordinates = require("./Coordinates")

const get = promisify(redisConn.get).bind(redisConn)
const set = promisify(redisConn.set).bind(redisConn)
const addSet = promisify(redisConn.sadd).bind(redisConn)
const del = promisify(redisConn.del).bind(redisConn)
const getSetPromise = promisify(redisConn.smembers).bind(redisConn)
const removeSet = promisify(redisConn.srem).bind(redisConn)

async function getSet(setStr){
    return await getSetPromise(setStr)/*.then(data => {
        let arrStr = "["+data+"]"
        console.log(arrStr)
        let arr = JSON.parse(arrStr)
        console.log(arr)
        return (JSON.parse("["+data+"]"))
    })*/
}

module.exports.addCar = async ({id, coordinates}) => {
    console.log("ADD CAR 1")
    await addSet("cars", JSON.stringify({id, coordinates}));
    console.log("ADD CAR 2")
    return setter({id: 'c'+id, coordinates})
}

module.exports.getCar = (id) => {
    return getter('c' + id).then(data => {console.log("GET CAR: " + JSON.stringify(data)); return data;})
}

module.exports.getCars = async () => {
    return await getSet("cars").then(data => {
        return JSON.parse("[" + data + "]")
    })
}

module.exports.setCarState = async (idCar, state) => {
    await set("carsState" + idCar, state);
    return state
}

module.exports.getCarState = async (idCar) => {
    return get("carsState" + idCar)
}

module.exports.getCarsInCrosswalk = async  (idCrosswalk) => {
    return getSet("carsInCross" + idCrosswalk).then(data => {
        return JSON.parse("["+data+"]")
    })
}


module.exports.addCarToCrossWalk = async (idCar, idCrosswalk) =>{
    await addSet("carsInCross" + idCrosswalk, JSON.stringify(idCar))
    let carsNearCross = await getSet("carsInCross" + idCrosswalk).then(data => {
        console.log("data AddCarToCrossWalk: " +data)
        return JSON.parse("["+data+"]")
    })
    return carsNearCross;
}


module.exports.removeCarFromCrossWalk = async (idCar, idCrosswalk) => {
    await removeSet("carsInCross" + idCrosswalk, JSON.stringify(idCar))
    let carsNearCross = await getSet("carsInCross" + idCrosswalk).then(data => {
        return (JSON.parse("["+data+"]"))
    })
    return carsNearCross;
}

module.exports.cleanCar = async (idCar) => {
    let crosswalks = JSON.parse(await Coordinates.getCrosswalks())
    for(let cw of crosswalks){
        console.log("Removing " + idCar + " from " + cw.oid)
        await removeSet("carsInCross" + cw.oid, idCar)
    }
}


function getter(id){
    return get(id).then(JSON.parse).then(data => {data.id = data.id.substring(1); return data})
}

function setter(object) {
    return set(object.id, JSON.stringify(object))
}
