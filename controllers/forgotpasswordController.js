const Signup = require('../models/signupModel');
const reset = require('../models/forgotpasswordModel');
const { post } = require('../routes/signupRoute');
const { where } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

exports.forgotpassword = async (req, res, next) => {
    const email = req.body.email;
    const userid = req.user.userId;
    const isactive = req.body.isactive;

    try {
        const requestId = uuidv4();

        await reset.create({
            id: requestId,
            isactive: isactive,
            UserId: userid,
        });

        const resetLink = `http://54.85.62.48:4000/password/reset/${requestId}`;

        const client = Sib.ApiClient.instance;

        var apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;
        var transEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'sshreyas567@gmail.com',
        }

        const receivers = [
            {
                email: email,
            },
        ]

        transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Your Password',
            textContent: `{{params.role}} `,
            htmlContent: `<h1>Reset Password</h1>
            <a href='${resetLink}'>Click on the link to reset your password</a>`,
            params: {
                role: 'Developer',
            },
        })
        .then((response) => {
            if (response.messageId) {
                res.status(200).json({ message: 'Reset email sent successfully' });
            } else {
                console.error('Email was not queued. Response:', response);
                res.status(500).json({ error: 'Failed to send reset email' });
            }
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send reset email' });
        });
    } catch (err) {
        console.error('Error creating reset request:', err);
        res.status(500).json({ error: 'Failed to create reset request' });
    }
}


exports.resetPassword = async (req, res) => {
    const requestId = req.params.requestId;

    try {
        const resetRequest = await reset.findOne({
            where: {
                id: requestId,
                isactive: true,
            }
        });

        if (resetRequest) {
            const newPasswordURL = `http://127.0.0.1:5500/ForgotPassword/newpassword.html?requestId=${requestId}`;
            res.redirect(newPasswordURL);
        } else {
            res.status(400).json({ error: 'Invalid or expired reset link' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to process reset request' });
    }
}

exports.updatePassword = async (req, res) => {
    const requestId = req.body.requestId;
    const newPassword = req.body.newPassword;

    console.log(req.user.userId);
    console.log(newPassword);

    try {
        const encryptedPassword = await bcrypt.hash(newPassword, 10);

        await Signup.update(
            { pass: encryptedPassword },
            { where: { id: req.user.userId } }
        );

        await reset.update(
            { isactive: false },
            { where: { id: requestId } }
        );

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update password' });
    }
}



 