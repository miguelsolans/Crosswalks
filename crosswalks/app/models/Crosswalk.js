const Sequelize = require('sequelize');
const sequelize = require('../services/mysql');

const Coordinates = require('./Coordinates');


const Crosswalk = sequelize.define('crosswalk', {
    oid: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    state: {
        type: Sequelize.STRING
    },
    cars: {
        type: Sequelize.INTEGER
    },
    pedestrians: {
        type: Sequelize.INTEGER
    },
    // Foreign Keys
    coordinates_oid: {
        type: Sequelize.INTEGER,
        required: true,
        references: {
            model: 'coordinates',
            key: 'oid',
        },
    },
    coordinates_oid_2: {
        type: Sequelize.INTEGER,
        required: true,
        references: {
            model: 'coordinates',
            key: 'oid',
        },
    }
});

//Crosswalk.belongsTo(Coordinates); // ESTÁ A CRIAR OUTRA FK

module.exports = Crosswalk;