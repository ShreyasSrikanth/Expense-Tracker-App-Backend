const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: true
    }
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;

// const content = sequelize.define('content',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement : true,
//         allowNull : false,
//         primaryKey: true
//     },
//     fileUrl:Sequelize.STRING
// });

// module.exports = content;