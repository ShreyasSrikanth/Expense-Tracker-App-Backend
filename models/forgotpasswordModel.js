const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Password = sequelize.define('ForgotPasswordRequests',{
    id: {
        type: Sequelize.STRING,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true
    },
    isactive: Sequelize.BOOLEAN
});

module.exports = Password;