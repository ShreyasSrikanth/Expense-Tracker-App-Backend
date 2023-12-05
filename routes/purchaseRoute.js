const path = require('path');
const express = require('express');
const Router = express.Router();

const expenseController = require('../controllers/purchaseController');
const authUser = require('../middlewear/auth');

Router.get('/premiummembership',authUser.authenticate,expenseController.premiumpurchase)