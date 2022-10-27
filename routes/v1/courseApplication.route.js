const express = require("express");
const courseApplicationController = require("../../controllers/courseApplication.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.post('/create', courseApplicationController.createCourseApplication)
router.get('/total-credit-taken/:profileId', courseApplicationController.getTotalCreditTaken)
router.get('/get-application-department', verifyToken, courseApplicationController.getApplicationForADepartment)



module.exports = router;