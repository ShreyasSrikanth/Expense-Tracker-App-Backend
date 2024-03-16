const Expense = require('../models/expenseModel');
const User = require('../models/signupModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Content = require('../models/contentModel');

const { post } = require('../routes/signupRoute');
const { where } = require('sequelize');

const sequelise = require('../util/database');

const UserServices = require('../services/userservices')
const S3services = require('../services/S3service');
let start;
let limit;
let day;
let month;
let year;
let viewExpenses;


exports.postExpense = async (req, res, next) => {
    console.log("hello")
    const category = req.body.category;
    const amount = req.body.amount;
    const desc = req.body.desc;

    try {
        // Find the user by their ID
        console.log(req.user)
        const user = await User.findOne({ _id: req.user._id });
        console.log("user====>",user)
        
        // Check if the user exists
        if (!user) {
            return res.status(500).json({ message: 'User does not exist to store the expense' });
        }

        // Update the user's total expense
        user.totalExpense += amount;
        await user.save();

        // Create a new expense
        const expense = new Expense({
            category: category,
            description: desc,
            amount: amount,
            userId: new ObjectId(req.user._id)
        });

        // Save the expense
        await expense.save();

        // Respond with success message
        return res.status(200).json({ message: 'Information is successfully stored' });
    } catch (err) {
        // Handle errors
        console.error(err);
        return res.status(500).json({ error: 'Failed to store information' });
    }
};

exports.getExpense = async (req, res, next) => {
    try {
        const dateString = req.params.date;
        start = parseInt(req.query.start);
        limit = parseInt(req.query.limit);

        const id = req.user._id;

       const idString = `${id}`;

        viewExpenses = req.query.viewExpenses
        console.log(idString,viewExpenses)
        
        const date = new Date(dateString);

        day = date.getDate();
        month = date.toLocaleString('default', { month: 'short' });
        year = date.getFullYear();

        const expenses = await UserServices.fetchExpense(idString, start, limit, day, month, year, viewExpenses);

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve information' });
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const userId = new ObjectId(req.user._id); // Assuming you're using JWT for authentication
        const expenseId = new ObjectId(req.body.ID);
        const amount = req.body.amount;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.totalExpense -= amount;
        await user.save();

        const deletedExpense = await Expense.findOneAndDelete({ _id: expenseId});
        console.log("==========>",deletedExpense)
        if (!deletedExpense) {
            return res.status(404).json({ error: 'No expense found with the given ID' });
        }

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};


// exports.downloadexpense = async (req, res, next) => {
//     try {

//         console.log("hiiiii")
//         const expenses = await UserServices.fetchExpense(req.user.userId, start, limit, day, month, year, viewExpenses)
//         console.log(expenses)
//         const StringifyExpenses = JSON.stringify(expenses);
//         const t = await sequelise.transaction();

//        // should depend on userId
//         const userId = req.user.id;
//         const filename = `Expense${userId}/${new Date()}.txt`;
//         const fileUrl = await S3services.uploadToS3(StringifyExpenses, filename);
//         console.log(fileUrl)

//         await Content.create({
//             fileUrl:fileUrl,
//             UserId:req.user.userId
//         },{transaction:t})
//         .then(async(res) => {
//             console.log(res);
//             await t.commit();
//         })
        

//         return res.status(200).json({ fileUrl, success: true });

//     } catch (error) {
//         res.status(500).json({ error: 'Failed to upload file to S3' });
//     }
// };

// exports.fetchUrls = async (req,res,next) => {
//     const urls = await Content.findAll({
//         attributes: ['fileUrl'],
//         where: { UserId: req.user.userId }
//     });

//     res.status(200).json({ urls, success: true });

// }

// exports.postExpense = async (req, res, next) => {
//     const category = req.body.category;
//     const amount = req.body.amount;
//     const desc = req.body.desc;
//     const t = await sequelise.transaction();

//     await Users.findOne({where:{id:req.user.userId},transaction: t })
//     .then(async (user) => {
//         user.totalExpense += amount;
//         await user.save({ transaction: t });   
        
//         await Expense.create({
//             category:category,
//             description: desc,
//             amount: amount,
//             UserId:req.user.userId
//         },{ transaction: t })
//         .then(async (result) => {
//             await t.commit();
//             return res.status(200).json({ message: 'Information is successfully stored' });
//         })
//         .catch(async (err) => {
//             await t.rollback();
//             return res.status(500).json({ error: 'Failed to store information' });
//         });
//     })
//     .catch(async(err) =>{
//         await t.rollback();
//         return res.status(500).json({message:'User doesnt exist to store the expense'});
//     })
// };

// exports.getExpense = async (req, res, next) => {
//     try {
//         const dateString = req.params.date;
//         start = parseInt(req.query.start);
//         limit = parseInt(req.query.limit);

//         viewExpenses = req.query.viewExpenses
        
//         const date = new Date(dateString);

//         day = date.getDate();
//         month = date.toLocaleString('default', { month: 'short' });
//         year = date.getFullYear();

//         const expenses = await UserServices.fetchExpense(req.user.userId, start, limit, day, month, year, viewExpenses);
//         res.json(expenses);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to retrieve information' });
//     }
// };


// exports.getAllExpense = async (req, res, next) => {
//     try {
//         const usersWithExpenses = await Users.findAll({
//             attributes:['id','name','totalExpense'],
//             order:[['totalExpense','DESC']]
//         });

//         res.json(usersWithExpenses);

//     } catch (error) {
//         res.status(500).json({ error: 'Failed to retrieve information' });
//     }
// };

// exports.deleteExpense = async (req, res, next) => {
//     const t = await sequelise.transaction();
//     const ID = req.body.ID;
//     const amount = req.body.amount;

//     Users.findOne({ where: { id: req.user.userId }, transaction: t })
//         .then(async (user) => {
//             if (!user) {
//                 await t.rollback();
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             user.totalExpense -= amount;
//             await user.save({ transaction: t });

//              Expense.destroy({ where: { id: ID }, transaction: t })
//             .then(async (deletedRows) => {
//                 if (deletedRows > 0) {
//                     await t.commit();
//                     res.status(200).json({ message: 'Expense(s) deleted successfully' });
//                 } else {
//                     await t.rollback();
//                     res.status(404).json({ error: 'No expense found with the given ID' });
//                 }
//             })
//             .catch(async (err) => {
//                 await t.rollback();
//                 res.status(500).json({ error: 'Failed to delete expense', details: err.message });
//             });
//         })
//         .catch(async (err) => {
//             await t.rollback();
//             res.status(500).json({ message: 'User doesnt exist to store the expense' });
//         });
// };

