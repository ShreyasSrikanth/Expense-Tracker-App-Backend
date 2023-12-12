const Expense = require('../models/expenseModel');
const authUser = require('../middlewear/auth');

exports.fetchExpense = async (id) => {
    const expenses = await Expense.findAll({where:{UserId:id}})
    return expenses;
}

