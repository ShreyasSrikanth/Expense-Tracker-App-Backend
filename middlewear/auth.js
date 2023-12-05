const jwt = require('jsonwebtoken');
const User = require('../models/signupModel');

const authenticate =(req,res,next) =>{
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token,"shreyassrikanthshreyassrikanthshreyassrikanth");
        User.findByPk(user.userId).then(result =>{
            req.user = user //assigning
            next() 
        })
    } catch(err){
        console.log(err);
        return res.status(404).json({success: false})
    }
}

module.exports = {
    authenticate
}