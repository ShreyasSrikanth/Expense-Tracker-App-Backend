const path = require('path');
const cors = require('cors');
const express = require('express');
const fs = require('fs')

const expenseModel = require('./models/expenseModel');
const userModel = require('./models/signupModel');
const orderModel = require('./models/purchaseModel');
const passwordModel = require('./models/forgotpasswordModel');
const contentModel = require('./models/contentModel');


const app = express();
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signupRoute');
const expenseRoute = require('./routes/expenseRoute');
const premiumRoute = require('./routes/purchaseRoute');
const passwordRoute = require('./routes/forgotpasswordRoute');

require('dotenv').config();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname,'access.log'),
  {flags:'a'}
);

// app.use(helmet());

// app.use(morgan('combined',{stream:accessLogStream}));

// app.use(cors());


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use('/users',signupRoute);
app.use('/password',passwordRoute)
app.use('/expense',expenseRoute);
app.use('/premium',premiumRoute);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/Login/Login.html');
});


app.get('/:dynamicRoute', (req, res) => {
  const dynamicRoute = req.params.dynamicRoute;
  res.send(`Dynamic Route: ${dynamicRoute}`);
});



userModel.hasMany(expenseModel);
expenseModel.belongsTo(userModel);

userModel.hasMany(orderModel);
orderModel.belongsTo(userModel);

userModel.hasMany(passwordModel);
passwordModel.belongsTo(userModel);

userModel.hasMany(contentModel);
contentModel.belongsTo(userModel);

sequelize.sync()
  .then(res => {
    app.listen(process.env.PORT || 4000);
  })
  .catch(err => {
    console.log(err);
  });

  
  