const path = require('path');
const express = require('express');
const Router = express.Router();

const expenseController = require('../controllers/expenseController');

Router.post('/storeexpense',expenseController.postExpense);
Router.get('/fetchexpense',expenseController.getExpense);
Router.post('/deleteexpense',expenseController.deleteExpense);


module.exports = Router;