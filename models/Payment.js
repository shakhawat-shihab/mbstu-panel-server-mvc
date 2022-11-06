const mongoose = require('mongoose')
const validator = require('validator')
const { ObjectId } = mongoose.Schema.Types;
const paymentSchema = mongoose.Schema({
    applicationId: {
        type: ObjectId,
        ref: 'course-application'
    },
    amount: {
        type: Number
    },
    paymentTime: {
        type: Date
    },
    last4: {
        type: Number
    },
    transaction: {
        type: String
    }

}, {
    timestamps: true
})



const Payment = mongoose.model("payment", paymentSchema);

module.exports = Payment;