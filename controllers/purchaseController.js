const razorpay = require('razorpay');
const Order = require('../models/purchaseModel');

exports.premiumpurchase = (req,res,next) =>{
    try{
        var rzp = new razorpay({
            key_id:'rzp_test_KgNdSwfFxGQgiH',
            key_secret:'DqTng92kqFtEGmKLdFnWJhlf'
        })
        const amount = 25;

        rzp.orders.create({amount,currency:"INR"},(err,order) =>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            
            req.user.createOrder({orderid: order.id, status:"PENDING"}).then(() =>{
                return res.status(201).json({order,key_id : rzp.key_id})
            })
        })
    } catch(err){
        console.log(err);
        return res.status(404).json({message:'something went wrong', error: err});
    }
}