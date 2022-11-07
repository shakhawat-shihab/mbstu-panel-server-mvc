const Payment = require("../models/Payment");
const { v4: uuidv4 } = require('uuid');
const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = 'mbstu6368b1ded4884'
const store_passwd = 'mbstu6368b1ded4884@ssl'
const is_live = false //true for live, false for sandbox


exports.initializeSSL = async (req, res) => {
    console.log("hitting ssl initialize")
    const productInfo = {
        //give
        total_amount: 100,
        currency: 'BDT',
        tran_id: uuidv4(),
        success_url: `http://localhost:5000/api/v1/payment/success`,
        fail_url: 'http://localhost:5000/api/v1/payment/failure',
        cancel_url: 'http://localhost:5000/api/v1/payment/cancel',
        ipn_url: 'http://localhost:5000/api/v1/payment/ipn',
        paymentStatus: 'pending',
        shipping_method: 'Courier',
        //give
        product_name: "T shirt",
        product_category: 'Clothings',
        //give
        product_profile: "An id of product",
        //give
        product_image: "image url",
        //give
        cus_name: "Shihab ",
        cus_email: "shihab@gmail.com",
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        //give
        ship_name: "tangail",
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
        multi_card_name: 'mastercard',
        value_a: 'ref001_A',
        value_b: 'ref002_B',
        value_c: 'ref003_C',
        value_d: 'ref004_D'
    };


    const sslcommer = new SSLCommerzPayment(store_id, store_passwd, is_live) //true for live default false for sandbox
    sslcommer.init(productInfo).then(data => {
        //process the response that got from sslcommerz 
        //https://developer.sslcommerz.com/doc/v4/#returned-parameters
        const info = { ...productInfo, ...data }
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