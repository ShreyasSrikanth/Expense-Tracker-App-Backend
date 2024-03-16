const jwt = require('jsonwebtoken');
const User = require('../models/signupModel');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: 'Authorization token not provided' });
        }
        
        const decodedToken = jwt.verify(token, "shreyassrikanthshreyassrikanthshreyassrikanth");
        const user = await User.findOne({ _id: decodedToken.userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    authenticate
}