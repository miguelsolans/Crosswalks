const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`, {
    define: {
        freezeTableName: true,
        timestamps: false,
    },
    omitNull: true
});

module.exports = sequelize;