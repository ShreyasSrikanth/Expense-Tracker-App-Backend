const Signup = require('../models/signupModel');
const { post } = require('../routes/signupRoute');
const { where } = require('sequelize');
const bcrypt = require('bcrypt');

exports.postItem = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;
    
    const saltround = 10;

    bcrypt.hash(pass,saltround, async (err,hash) => {
        Signup.create({
            name: name,
            email: email,
            pass:hash
        })
        .then(result => {
            res.status(200).json({ message: 'Information is successfully stored' });
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to store information' });
        });
    })
};

exports.getItem = (req,res,next) =>{
    const users = Signup.findAll({ attributes: { exclude: ['pass'] } })
    .then(users =>{
        res.json(users);
    })
};

exports.loginUser = (req,res,next) => {
    const { email, pass } = req.body;

    try {
        const user =  Signup.findOne({ where: { email: email } });

        if (user) {
            const isMatch =  bcrypt.compare(pass, user.pass);
            if (isMatch) {
                res.status(200).json({ message: 'Login successful!' });
            } else {
                res.status(404).json({ message: 'Invalid email or password' });
            }
        } else {
            res.status(404).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to perform login' });
    }
};

    

