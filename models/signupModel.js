const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    isPremiumUser: {
        type: Boolean,
        default: false
    },
    totalExpense: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const items = sequelize.define('Users',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement : true,
//         allowNull : false,
//         primaryKey: true
//     },
//     name:{
//         type:Sequelize.STRING,
//         autoIncrement : false,
//         allowNull : false,
//         primaryKey: false
//     },
//     email:{
//         type:Sequelize.STRING,
//         autoIncrement : false,
//         allowNull : false,
//         primaryKey: false
//     },
//     pass:{
//         type:Sequelize.STRING,
//         autoIncrement : false,
//         allowNull : false,
//         primaryKey: false
//     },
//     ispremiumuser:Sequelize.BOOLEAN,
//     totalExpense:Sequelize.INTEGER
// });

// module.exports = items;
