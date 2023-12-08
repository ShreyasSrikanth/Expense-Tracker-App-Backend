const razorpay = require('razorpay');
const Order = require('../models/purchaseModel');
const User = require('../models/signupModel');

exports.premiumpurchase = (req,res,next) =>{
    try{
        var rzp = new razorpay({
            key_id:'rzp_test_sPYSbU2yJb4naB',
            key_secret:'Ch3HIvGuDfUy13VDGIuqQMoS'
        })
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                console.error('Razorpay Order Creation Error:', err);
                return res.status(500).json({ message: 'Razorpay Order Creation Error', error: err });
            }
            Order.create({ orderid: order.id, status: "PENDING" })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch(createOrderError => {
                    console.error('Error creating order in the system:', createOrderError);
                    return res.status(500).json({ message: 'Error creating order in the system', error: createOrderError });
                });
        });
        
    } catch(err){
        console.log(err);
        return res.status(404).json({message:'something went wrong', error: err});
    }
}

exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
        const user = await User.findByPk(req.user.userId); 

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await user.update({ ispremiumuser: true });
        return res.status(202).json({ success: true, message: 'Transaction Successful' });

    } catch (err) {
        console.error('Error processing transaction:', err);
        return res.status(500).json({ success: false, message: 'Error processing transaction', error: err.message });
    }
};
