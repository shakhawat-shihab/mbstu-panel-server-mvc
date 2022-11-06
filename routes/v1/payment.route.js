const express = require("express");
const paymentController = require("../../controllers/payment.controller");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();


router.post('/create-payment-intent', verifyToken, paymentController?.paymentIntent);
router.post('/create-payment', verifyToken, paymentController?.createPayment);

module.exports = router;