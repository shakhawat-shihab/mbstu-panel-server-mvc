const Payment = require("../models/Payment");

const stripe = require("stripe")(process.env.STRIPE_SECRET);
exports.paymentIntent = async (req, res) => {
    try {
        const paymentInfo = req.body;
        console.log('cpi ', paymentInfo);
        const amount = paymentInfo.price;
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card']
        })
        res.status(200).json({
            status: "success",
            message: "Successfully loaded",
            data: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to make payment intent",
            error: error.message,
        });
    }

    // res.json({
    //     clientSecret: paymentIntent.client_secret,
    // });
}

exports.createPayment = async (req, res) => {
    try {
        const payment = req.body;
        console.log('payment save ', payment);
        const result = Payment.save(payment)
        res.status(200).json({
            status: "success",
            message: "Successfully saved",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to save",
            error: error.message,
        });
    }

    // res.json({
    //     clientSecret: paymentIntent.client_secret,
    // });
}