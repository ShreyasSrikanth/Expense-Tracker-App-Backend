const path = require('path');
const express = require('express');
const Router = express.Router();

const expenseController = require('../controllers/expenseController');
const authUser = require('../middlewear/auth');

Router.post('/storeexpense',expenseController.postExpense);
Router.get('/fetchexpense',authUser.authenticate,expenseController.getExpense);
Router.post('/deleteexpense',expenseController.deleteExpense);


module.exports = Router;