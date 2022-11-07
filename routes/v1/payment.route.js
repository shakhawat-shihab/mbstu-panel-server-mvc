const express = require("express");
const paymentController = require("../../controllers/payment.controller");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const CourseApplication = require("../../models/CourseApplication");
const Payment = require("../../models/Payment");



router.post('/ssl-init', paymentController?.initializeSSL);

router.post("/success", async (req, res) => {
    // console.log('trannnnn ==== ', req.body);
    const update = await CourseApplication.updateOne({ transactionId: req?.body?.tran_id }, { $set: { isPaid: true } })
    // console.log('update ', update)
    const payment = await Payment.create(req.body)

    res.redirect(`http://localhost:3000/dashboard/course-registration-view`)
    // res.status(400).json({
    //     message: "SSL successyyyyy"
    // })
})
router.post("/failure", async (req, res) => {
    // const result = await orderCollection.deleteOne({ tran_id: req.body.tran_id })
    // res.redirect(`http://localhost:3000`)
    res.status(400).json({
        message: "SSL failure"
    })
})
router.post("/cancel", async (req, res) => {
    // const result = await orderCollection.deleteOne({ tran_id: req.body.tran_id })
    // res.redirect(`http://localhost:3000`)
    res.status(400).json({
        message: "SSL cancel"
    })
})
router.post("/ipn", (req, res) => {
    // console.log(req.body)
    // res.send(req.body);
    res.status(400).json({
        message: "SSL ipn"
    })
})
router.post('/validate', async (req, res) => {
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

})



module.exports = router;