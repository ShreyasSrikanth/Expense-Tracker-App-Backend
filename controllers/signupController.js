const Signup = require('../models/signupModel');
const { post } = require('../routes/signupRoute');
const { where } = require('sequelize');

exports.postItem = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;
    
    console.log(name);
    console.log(email);
    console.log(pass);

    Signup.create({
        name: name,
        email: email,
        pass:pass
    })
    .then(result => {
        res.status(200).json({ message: 'Information is successfully stored' });
    })
    .catch(err => {
        res.status(500).json({ error: 'Failed to store information' });
    });
};

exports.getItem = (req,res,next) =>{
    Signup.findAll()
    .then(users =>{
        res.json(users);
    })
};

exports.loginUser = (req,res,next) => {
    const email = req.body.email;
    const pass = req.body.pass;
    console.log(email);
    console.log(pass);

    Signup.findOne({
        where: {
            email: email,
            pass: pass
        }
    })
    .then(user => {
        if (user) {
            res.status(200).json({ message: 'Login successful!' });
        } else {
            res.status(404).json({ message: 'Invalid email or password' });
        }
    })
    .catch(err => {
        res.status(500).json({ error: 'Failed to perform login' });
    });
};

    

