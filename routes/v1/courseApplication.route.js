const express = require("express");
const courseApplicationController = require("../../controllers/courseApplication.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.post('/create', courseApplicationController.createCourseApplication)
router.get('/total-credit-taken/:profileId', courseApplicationController.getTotalCreditTaken)

router.get('/get-applications-department', verifyToken, courseApplicationController.getApplicationForADepartment)
router.get('/get-applications-hall', verifyToken, courseApplicationController.getApplicationForAHall)
router.get('/get-applications-academic', verifyToken, courseApplicationController.getApplicationForAcademic)

router.get('/get-application-details/:applicationId', verifyToken, courseApplicationController.getApplicationDetails)

router.put('/approve-application-by-dept-chairman', verifyToken, courseApplicationController.approveApplicationByDept)
router.put('/approve-application-by-hall', verifyToken, courseApplicationController.approveApplicationByHall)
router.put('/approve-application-by-academic-section', verifyToken, courseApplicationController.approveApplicationByAcademicSection)

router.put('/deny-application-by-dept-chairman', verifyToken, courseApplicationController.denyApplicationByDept)
router.put('/deny-application-by-hall', verifyToken, courseApplicationController.denyApplicationByHall)
router.put('/deny-application-by-academic-section', verifyToken, courseApplicationController.denyApplicationByAcademicSection)







module.exports = router;