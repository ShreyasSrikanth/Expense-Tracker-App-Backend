const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    paymentid: {
        type: String,
        required: false
    },
    orderid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Order = sequelize.define('order',{
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     paymentid: Sequelize.STRING,
//     orderid: Sequelize.STRING,
//     status: Sequelize.STRING
// });

// module.exports = Order;