const Expense = require('../models/expenseModel');
const authUser = require('../middlewear/auth');

exports.fetchExpense = async (id,start,limit) => {
    console.log('start=====>',start);
    const expenses = await Expense.findAll({where:{UserId:id},
        offset: start, 
        limit: limit })
    return expenses;
}

