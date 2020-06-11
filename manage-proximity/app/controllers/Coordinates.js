const redisConn = require('./redis-connection').getConnection()
const { promisify } = require("util");

const get = promisify(redisConn.get).bind(redisConn)
const set = promisify(redisConn.set).bind(redisConn)
const addSet = promisify(redisConn.sadd).bind(redisConn)
const getSet = promisify(redisConn.smembers).bind(redisConn)
const removeSet = promisify(redisConn.srem).bind(redisConn)


module.exports.addCrosswalks = async (crosswalks) => {
    return setterKeyValue("crosswalks", JSON.stringify(crosswalks))
}

module.exports.getCrosswalks= () => {
    return get("crosswalks").then(data => {return JSON.parse(data);})
}

function setterKeyValue(key, value) {
    return set(key, JSON.stringify(value))
}

