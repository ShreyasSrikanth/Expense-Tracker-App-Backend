const path = require('path');
const express = require('express');
const Router = express.Router();

const expenseController = require('../controllers/expenseController');
const authUser = require('../middlewear/auth');

Router.post('/storeexpense',authUser.authenticate,expenseController.postExpense);

Router.get('/fetchexpense/:date', authUser.authenticate, expenseController.getExpense);

Router.get('/fetchAllexpense',expenseController.getAllExpense);

Router.post('/deleteexpense',authUser.authenticate,expenseController.deleteExpense);

// Router.get('/download',authUser.authenticate,expenseController.downloadexpense)

// Router.get('/urls',authUser.authenticate,expenseController.fetchUrls)

module.exports = Router;