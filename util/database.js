const Sequelize = require('sequelize');
require('dotenv').config();

const sequelise = new Sequelize(process.env.DB_SCHEMA_NAME,process.env.DB_ROOT_USER,process.env.DB_ROOT_PASS,{
    dialect: 'mysql',
    host: process.env.DB_HOST
});

module.exports = sequelise;