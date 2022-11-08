const express = require("express");
const paymentController = require("../../controllers/payment.controller");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const CourseApplication = require("../../models/CourseApplication");
const Payment = require("../../models/Payment");

router.post('/ssl-init', paymentController?.initializeSSL);
router.post("/success", paymentController?.successSSL)
router.post("/failure", paymentController?.failureSSL)
router.post("/cancel", paymentController.cancelSSL)
router.post("/ipn", paymentController.ipnSSL)
router.post('/validate', paymentController.validateSSL)

module.exports = router;