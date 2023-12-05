const Expense = require('../models/expenseModel');
const { post } = require('../routes/signupRoute');
const { where } = require('sequelize');

exports.postExpense = (req, res, next) => {
    const category = req.body.category;
    const amount = req.body.amount;
    const desc = req.body.desc;
    
    Expense.create({
        category:category,
        description: desc,
        amount: amount
    })
    .then(result => {
        res.status(200).json({ message: 'Information is successfully stored' });
    })
    .catch(err => {
        res.status(500).json({ error: 'Failed to store information' });
    });
};

exports.getExpense = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({where:{UserId:req.user.userId}})
        console.log(expenses)
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve information' });
    }
};

exports.deleteExpense = async (req, res, next) => {

    const ID = req.body.ID;
    
    try {
        const deletedRows = await Expense.destroy({
            where: { id: ID }
        });

        if (deletedRows > 0) {
            res.status(200).json({ message: 'Expense(s) deleted successfully' });
        } else {
            res.status(404).json({ error: 'No expense found with the given category' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }

    // try {
    //     const expenses = await Expense.findAll();
    // } catch (error) {
    //     res.status(500).json({ error: 'Failed to retrieve information' });
    // }
};