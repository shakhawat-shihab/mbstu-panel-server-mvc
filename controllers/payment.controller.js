const Payment = require("../models/Payment");
const { v4: uuidv4 } = require('uuid');
const SSLCommerzPayment = require('sslcommerz-lts');
const CourseApplication = require("../models/CourseApplication");
const store_id = process.env.ssl_store_id
const store_passwd = process.env.ssl_store_password
const is_live = process.env.ssl_is_live //true for live, false for sandbox


exports.initializeSSL = async (req, res) => {
    console.log("hitting ssl initialize ", req.body);
    const transactionId = uuidv4();
    const productInfo = {
        total_amount: 100,
        currency: 'BDT',
        tran_id: 'REF123', // use unique tran_id for each api call
        success_url: 'http://localhost:5000/api/v1/payment/success',
        fail_url: 'http://localhost:5000/api/v1/payment/fail',
        cancel_url: 'http://localhost:5000/api/v1/payment/cancel',
        ipn_url: 'http://localhost:5000/api/v1/payment/ipn',
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
        ship_country: 'Bangladesh',
    };

    //save transaction id to the application
    const trans = await CourseApplication.updateOne({ _id: req?.body?.applicantionId }, { $set: { transactionId: transactionId } })
    console.log('trans   ===>  ', trans)
    console.log('productInfo   ===>  ', productInfo)

    const sslcommer = new SSLCommerzPayment(store_id, store_passwd, is_live) //true for live default false for sandbox
    sslcommer.init(productInfo).then(data => {
        //process the response that got from sslcommerz 
        //https://developer.sslcommerz.com/doc/v4/#returned-parameters
        const info = { ...productInfo, ...data }
        console.log('info.GatewayPageURL ', info.GatewayPageURL);
        if (info.GatewayPageURL) {
            res.json(info.GatewayPageURL)
        }
        else {
            return res.status(400).json({
                message: "SSL session was not successful"
            })
        }

    });
}