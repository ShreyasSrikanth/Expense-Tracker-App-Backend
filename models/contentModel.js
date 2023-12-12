const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const content = sequelize.define('content',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey: true
    },
    fileUrl:Sequelize.STRING
});

module.exports = content;