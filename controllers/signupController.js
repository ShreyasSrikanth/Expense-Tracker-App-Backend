const Signup = require('../models/signupModel');
const { post } = require('../routes/signupRoute');
const { where } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

exports.postItem = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;
    const ispremiumuser = req.body.ispremiumuser;
     const totalExpense = req.body.totalExpense;
    
    const saltround = 10;

    bcrypt.hash(pass, saltround, async (err, hash) => {
        Signup.create({
            name: name,
            email: email,
            pass: hash,
            ispremiumuser:ispremiumuser,
            totalExpense:totalExpense
        })
        .then(result => {
            res.status(200).json({ message: 'Information is successfully stored' });
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to store information' });
        });
    })
};

exports.getItem = async (req, res, next) => {
    try {
        const users = await Signup.findAll({ attributes: { exclude: ['pass'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve information' });
    }
};

function generateToken(id,name){
    return jwt.sign({userId:id,name:name},'shreyassrikanthshreyassrikanthshreyassrikanth')
}


exports.loginUser = async (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.pass;

    let user = await Signup.findOne({ where: { email: email } });
    
    try {
        if (user) {
            const isMatch = await bcrypt.compare(pass, user.pass);
            if (isMatch) {
                console.log(user.ispremiumuser)
                res.status(200).json({ message: 'Login successful!', token:generateToken(user.id,user.name) , ispremiumuser: user.ispremiumuser });
            } else {
                res.status(404).json({ message: 'Invalid email or password' });
            }
        } else {
            res.status(404).json({ message: 'Invalid email or password' });
        } 
    } catch (err) {
        res.status(500).json({ error: 'Failed to perform login' });
    }
};

exports.forgotpassword = async(req,res,next) =>{
    const email = req.body.email;
    
    const client = Sib.ApiClient.instance

    var apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;
    var transEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
        email: 'sshreyas567@gmail.com',
    }

    const receivers = [
        {
            email:email,
        },
    ]

    transEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Reset Your Password' ,
        textContent: `{{params.role}} `,
        htmlContent:`<h1>Reset Password</h1>
        <a href='google.com'>Click on the link to reset your password</a>
        `,
        params:{
            role: 'Developer',
        },
    })
    .then((response) => {
        console.log('Email sent successfully:', response);
        res.status(200).json({ message: 'Email sent successfully' });
    })
    .catch((error) => {
        console.error('Failed to send email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    });
}
