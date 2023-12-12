const Expense = require('../models/expenseModel');
const Users = require('../models/signupModel');
const { post } = require('../routes/signupRoute');
const { where } = require('sequelize');
const sequelise = require('../util/database');
const AWS = require('aws-sdk');
require('dotenv').config();

function uploadToS3(data, filename){
    const BUCKET_NAME = 'expensetrackingapp2023';
    const IAM_USER_KEY = 'AKIAWW642STSA6YRWSOV';
    const IAM_USER_SECRET = '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';

    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data
    };

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.error('Error listing objects:', err);
            } else {
                console.log('Success:', s3response);
            }
        });
    });
}

exports.downloadexpense = async (req, res, next) => {
    try {
        const expenses = await exports.getExpense(req, res, next);
        const StringifyExpenses = JSON.stringify(expenses);
        //problem with this approach is everytime user downloads he updates file with his own expenses instead of downloading his own expenses
        const filename = 'Expense.txt';
        const fileUrl = await uploadToS3(StringifyExpenses, filename);
        res.status(200).json({ fileUrl, success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to upload file to S3' });
    }
};

exports.postExpense = async (req, res, next) => {
    const category = req.body.category;
    const amount = req.body.amount;
    const desc = req.body.desc;
    const t = await sequelise.transaction();

    await Users.findOne({where:{id:req.user.userId},transaction: t })
    .then(async (user) => {
        user.totalExpense += amount;
        await user.save({ transaction: t });   
        
        await Expense.create({
            category:category,
            description: desc,
            amount: amount,
            UserId:req.user.userId
        },{ transaction: t })
        .then(async (result) => {
            await t.commit();
            return res.status(200).json({ message: 'Information is successfully stored' });
        })
        .catch(async (err) => {
            await t.rollback();
            return res.status(500).json({ error: 'Failed to store information' });
        });
    })
    .catch(async(err) =>{
        await t.rollback();
        return res.status(500).json({message:'User doesnt exist to store the expense'});
    })
};

exports.getExpense = async (req, res, next) => {
    try {
        const date = req.params.date
        const expenses = await Expense.findAll({where:{UserId:req.user.userId}})
        res.json(expenses)
        return expenses;
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve information' });
    }
};

exports.getAllExpense = async (req, res, next) => {
    try {
        const usersWithExpenses = await Users.findAll({
            attributes:['id','name','totalExpense'],
            order:[['totalExpense','DESC']]
        });

        res.json(usersWithExpenses);

    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve information' });
    }
};

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelise.transaction();
    const ID = req.body.ID;
    const amount = req.body.amount;

    Users.findOne({ where: { id: req.user.userId }, transaction: t })
        .then(async (user) => {
            if (!user) {
                await t.rollback();
                return res.status(404).json({ message: 'User not found' });
            }

            user.totalExpense -= amount;
            await user.save({ transaction: t });

             Expense.destroy({ where: { id: ID }, transaction: t })
            .then(async (deletedRows) => {
                if (deletedRows > 0) {
                    await t.commit();
                    res.status(200).json({ message: 'Expense(s) deleted successfully' });
                } else {
                    await t.rollback();
                    res.status(404).json({ error: 'No expense found with the given ID' });
                }
            })
            .catch(async (err) => {
                await t.rollback();
                res.status(500).json({ error: 'Failed to delete expense', details: err.message });
            });
        })
        .catch(async (err) => {
            await t.rollback();
            res.status(500).json({ message: 'User doesnt exist to store the expense' });
        });
};

