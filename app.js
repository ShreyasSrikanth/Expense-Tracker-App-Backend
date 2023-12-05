const path = require('path');
const cors = require('cors');
const express = require('express');
const expenseModel = require('./models/expenseModel');
const userModel = require('./models/signupModel');
const orderModel = require('./models/purchaseModel')

const app = express();

const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signupRoute');
const expenseRoute = require('./routes/expenseRoute');
const premiumRoute = require('./routes/purchaseRoute');


app.use(cors({
    origin:['http://127.0.0.1:5500','http://127.0.0.1:5500/Login/Login.html'],
    methods:['GET','POST'],
    credentials:true
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/users',signupRoute);
app.use('/expense',expenseRoute);
app.use('/premium',premiumRoute);

userModel.hasMany(expenseModel);
expenseModel.belongsTo(userModel);

userModel.hasMany(orderModel);
orderModel.belongsTo(userModel);

sequelize.sync()
  .then(res => {
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });
  