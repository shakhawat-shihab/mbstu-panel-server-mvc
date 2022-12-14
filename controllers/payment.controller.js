const { v4: uuidv4 } = require('uuid');
const SSLCommerzPayment = require('sslcommerz-lts');
const CourseApplication = require("../models/CourseApplication");
const Payment = require('../models/Payment');
const store_id = process.env.ssl_store_id
const store_passwd = process.env.ssl_store_password

exports.initializeSSL = async (req, res) => {
    console.log("hitting ssl initialize ", store_id, store_passwd, req.body);
    const { numberOfRegularCourses = 0, numberOfBacklogCourses = 0, numberOfSpecialCourses = 0 } = req.body;
    const regularCoursesRate = 110;
    const backlogCoursesRate = 300;
    const specialCoursesRate = 500;
    const marksheetFee = 100;
    const amount = numberOfRegularCourses * regularCoursesRate + numberOfBacklogCourses * backlogCoursesRate + numberOfSpecialCourses * specialCoursesRate + marksheetFee;
    const tran_id = uuidv4();

    const productInfo = {
        total_amount: amount,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `${process.env.backEnd}/api/v1/payment/success`,
        fail_url: `${process.env.backEnd}/api/v1/payment/fail`,
        cancel_url: `${process.env.backEnd}/api/v1/payment/cancel`,
        ipn_url: `${process.env.backEnd}/api/v1/payment/ipn`,
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh'
    };

    // save transaction id to the application
    const trans = await CourseApplication.updateOne({ _id: req?.body?.applicationId }, { $set: { tran_id: tran_id } })
    // console.log(trans);

    const sslcommer = new SSLCommerzPayment(store_id, store_passwd, false) //true for live default false for sandbox
    sslcommer.init(productInfo).then(data => {
        //process the response that got from sslcommerz 
        //https://developer.sslcommerz.com/doc/v4/#returned-parameters
        const info = { ...productInfo, ...data }
        // console.log('info.GatewayPageURL ', info.GatewayPageURL);
        // console.log('info.GatewayPageURL ', data);
        if (info.GatewayPageURL) {
            // console.log('if part')
            res.json(info.GatewayPageURL)
        }
        else {
            // console.log('else part')
            return res.status(400).json({
                message: "SSL session was not successful"
            })
        }
    });
}


exports.successSSL = async (req, res) => {
    console.log('trannnnn ==== ', req.body);
    // console.log('update ', update)
    const payment = await Payment.create(req.body);

    const update = await CourseApplication.updateOne({ tran_id: req?.body?.tran_id }, { $set: { isPaid: true, paymentId: payment?._id } })

    const findApplicationWithtran_id = await CourseApplication.findOne({ paymentId: payment?._id })
    console.log('findApplicationWithtran_id ', findApplicationWithtran_id)
    res.redirect(`${process.env.frontEnd}/dashboard/course-registration-view/${findApplicationWithtran_id?._id}`)
    // res.status(400).json({
    //     message: "SSL success"
    // })
}

exports.failureSSL = async (req, res) => {
    // const result = await orderCollection.deleteOne({ tran_id: req.body.tran_id })
    // res.redirect(`${process.env.frontEnd}`)
    console.log('failure')
    res.redirect(`${process.env.frontEnd}/dashboard/course-registration-view`)
    // res.status(400).json({
    //     message: "SSL failure"
    // })
}

exports.cancelSSL = async (req, res) => {
    // const result = await orderCollection.deleteOne({ tran_id: req.body.tran_id })
    // res.redirect(`${process.env.frontEnd}`)
    console.log('cancel')
    res.redirect(`${process.env.frontEnd}/dashboard/course-registration-view`)
    // res.status(400).json({
    //     message: "SSL cancel"
    // })
}

exports.ipnSSL = async (req, res) => {
    // console.log(req.body)
    // res.send(req.body);
    console.log('ipn')
    res.redirect(`${process.env.frontEnd}/dashboard/course-registration-view`)
    // res.status(400).json({
    //     message: "SSL ipn"
    // })
}

exports.validateSSL = async (req, res) => {
    // const result = await orderCollection.findOne({
    //     tran_id: req.body.tran_id
    // })
    // if (result.val_id === req.body.val_id) {
    //     const update = await orderCollection.updateOne({ tran_id: req.body.tran_id }, {
    //         $set: {
    //             paymentStatus: 'paymentComplete'
    //         }
    //     })
    //     console.log(update);
    //     res.send(update.modifiedCount > 0)
    // }
    // else {
    //     res.send("Chor detected")
    // }
    res.status(400).json({
        message: "SSL validate"
    })

}