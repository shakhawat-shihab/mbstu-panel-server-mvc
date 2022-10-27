const express = require("express");
const courseApplicationController = require("../../controllers/courseApplication.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.post('/create', courseApplicationController.createCourseApplication)
router.get('/total-credit-taken/:profileId', courseApplicationController.getTotalCreditTaken)
router.get('/get-application-department', verifyToken, courseApplicationController.getApplicationForADepartment)
router.get('/get-application-hall', verifyToken, courseApplicationController.getApplicationForAHall)
router.get('/get-application-academic', verifyToken, courseApplicationController.getApplicationForAcademic)




module.exports = router;