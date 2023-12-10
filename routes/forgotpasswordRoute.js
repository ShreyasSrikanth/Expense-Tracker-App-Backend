const path = require('path');
const express = require('express');
const Router = express.Router();

const passwordController = require('../controllers/forgotpasswordController');
const authUser = require('../middlewear/auth');

Router.post('/forgotpassword',authUser.authenticate,passwordController.forgotpassword);
Router.get('/reset/:requestId',passwordController.resetPassword);

Router.post('/reset',authUser.authenticate,passwordController.updatePassword);

module.exports = Router;