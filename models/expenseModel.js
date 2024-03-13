const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const expense = sequelize.define('Expenses',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement : true,
//         allowNull : false,
//         primaryKey: true
//     },
//     category:{
//         type:Sequelize.STRING,
//         autoIncrement : false,
//         allowNull : false,
//         primaryKey: false
//     },
//     description:{
//         type:Sequelize.STRING,
//         autoIncrement : false,
//         allowNull : false,
//         primaryKey: false
//     },
//     amount:{
//         type:Sequelize.INTEGER,
//         autoIncrement : false,
//         allowNull : false,
//         primaryKey: false
//     },
//     createdAt: {
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//     },
//     updatedAt: {
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//     }
// });

// module.exports = expense;