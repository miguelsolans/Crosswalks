const redis = require('redis');
var client = redis.createClient(`redis://${process.env.REDIS_HOST}`);

client.on('error', function(err){
    console.log('Something went wrong ', err);
    client = null
});

client.on('connect', function() {
    console.log('Redis client connected');
});

module.exports.getConnection = () => {
    return client;
};