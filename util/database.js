const Sequelize = require('sequelize');

const sequelise = new Sequelize('expense-tracker','root','root',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelise;