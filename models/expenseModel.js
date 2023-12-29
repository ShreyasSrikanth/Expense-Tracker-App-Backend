const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const expense = sequelize.define('Expenses',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey: true
    },
    category:{
        type:Sequelize.STRING,
        autoIncrement : false,
        allowNull : false,
        primaryKey: false
    },
    description:{
        type:Sequelize.STRING,
        autoIncrement : false,
        allowNull : false,
        primaryKey: false
    },
    amount:{
        type:Sequelize.INTEGER,
        autoIncrement : false,
        allowNull : false,
        primaryKey: false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

module.exports = expense;