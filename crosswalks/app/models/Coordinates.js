const Sequelize = require('sequelize');
const sequelize = require('../services/mysql');

const Coordinates = sequelize.define('coordinates', {
    oid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    latitude: {
        type: Sequelize.FLOAT,
        required: true
    },
    longitude: {
        type: Sequelize.FLOAT,
        required: true
    }
});

module.exports = Coordinates;