const Expense = require('../models/expenseModel');
const authUser = require('../middlewear/auth');

exports.fetchExpense = async (id,start,limit,day,month,year,viewExpenses) => {
    const { Op } = require('sequelize');
    const sequelize = require('sequelize'); // Ensure sequelize is properly imported

    const parsedDay = parseInt(day);
    const parsedYear = parseInt(year);

    
    if(viewExpenses==="daily"){
        const monthMap = {
            Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
            Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
        };
        const monthNumber = monthMap[month];
        const parsedMonth = parseInt(monthNumber);

        const expenses = await Expense.findAll({
            where: {
                UserId: id,
                createdAt: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('DAY', sequelize.col('createdAt')), parsedDay),
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('createdAt')), parsedMonth),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), parsedYear)
                        
                    ]
                }
            },
            offset: start,
            limit: limit
        });
        console.log(expenses);

        return expenses;
    }
    else if(viewExpenses==="monthly"){
        const monthMap = {
            Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
            Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
        };
        const monthNumber = monthMap[month];
        const parsedMonth = parseInt(monthNumber);

        const expenses = await Expense.findAll({
            where: {
                UserId: id,
                createdAt: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('createdAt')), parsedMonth),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), parsedYear)
                    ]
                }
            },
            offset: start,
            limit: limit
        });

        return expenses;
    }
    else if(viewExpenses==="yearly"){
        const expenses = await Expense.findAll({
            where: {
                UserId: id,
                createdAt: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), parsedYear)
                    ]
                }
            },
            offset: start,
            limit: limit
        });

        return expenses;
    }

}

