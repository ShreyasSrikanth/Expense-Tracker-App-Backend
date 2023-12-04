const path = require('path');
const express = require('express');
const Router = express.Router();

const signupController = require('../controllers/signupController');

Router.post('/signup',signupController.postItem);
Router.get('/fetchusers',signupController.getItem);

Router.post('/login',signupController.loginUser)

module.exports = Router;