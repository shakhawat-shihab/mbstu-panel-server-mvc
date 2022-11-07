const mongoose = require('mongoose')
const validator = require('validator')
const { ObjectId } = mongoose.Schema.Types;
const paymentSchema = mongoose.Schema({
    applicationId: {
        type: ObjectId,
        ref: 'course-application'
    },
    customer_name: {
        type: String
    },
    customer_email: {
        type: String
    },
    total_amount: {
        type: Number
    },
    currency: {
        type: String
    },
    tran_id: {
        type: String
    },
    paymentTime: {
        type: Date
    },


}, {
    timestamps: true
})



const Payment = mongoose.model("payment", paymentSchema);

module.exports = Payment;