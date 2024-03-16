const moment = require('moment-timezone');
const Expense = require('../models/expenseModel');

exports.fetchExpense = async (id, start, limit, day, month, year, viewExpenses) => {
    try {
        const parsedDay = parseInt(day);
        const parsedYear = parseInt(year);

        let query = { userId: id };

        console.log(id)

        const monthMap = {
            Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
            Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
        };

        const monthNumber = monthMap[month];
        const parsedMonth = parseInt(monthNumber);

        // Construct the date in IST for the given day, month, and year
        const gt = moment.tz([parsedYear, parsedMonth - 1, parsedDay], 'Asia/Kolkata').toDate();
        const lt = moment.tz([parsedYear, parsedMonth - 1, parsedDay + 1 ], 'Asia/Kolkata').toDate();

        console.log("Start time for query:", gt);
        console.log("end time for query:", lt);

        if (viewExpenses === "daily") {
            query.createdAt = {
                $gte: gt, // Greater than or equal to start of today
                $lt: lt  // Less than start of tomorrow
            };
        } else if (viewExpenses === "monthly") {
            
            query.createdAt = {
                $gte: new Date(parsedYear, parsedMonth - 1, 1), 
                $lt: new Date(parsedYear, parsedMonth, 1) 
            };
        } else if (viewExpenses === "yearly") {
            
            query.createdAt = {
                $gte: new Date(parsedYear, 0, 1), 
                $lt: new Date(parsedYear + 1, 0, 1) 
            };
        } else {
            throw new Error('Invalid viewExpenses value');
        }

        console.log("Query:", query);

        const expenses = await Expense.find(query)
        .skip(start)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

    console.log("Expenses:", expenses);
            

        console.log("Expenses:", expenses);

        return expenses;
    } catch (error) {
        throw new Error('Failed to fetch expenses');
    }
};
