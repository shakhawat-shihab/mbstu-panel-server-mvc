const express = require("express");
const courseApplicationController = require("../../controllers/courseApplication.controller");
const authorization = require("../../middleware/authorization");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.post('/create', verifyToken, authorization('student'), courseApplicationController.createCourseApplication)
router.get('/total-credit-taken', verifyToken, authorization('student'), courseApplicationController.getTotalCreditTaken)

router.get('/get-my-applications', verifyToken, authorization('student'), courseApplicationController.getApplicationForAStudent)

router.get('/get-applications-department', verifyToken, authorization('dept-chairman'), courseApplicationController.getApplicationForADepartment)
router.get('/get-applications-hall', verifyToken, authorization('hall-provost'), courseApplicationController.getApplicationForAHall)
router.get('/get-applications-academic', verifyToken, authorization('academic-committee'), courseApplicationController.getApplicationForAcademic)

router.get('/get-application-details/:applicationId', verifyToken, authorization('student, academic-committee, hall-provost, dept-chairman'), courseApplicationController.getApplicationDetails)

router.put('/approve-application-by-dept-chairman', verifyToken, authorization('dept-chairman'), courseApplicationController.approveApplicationByDept)
router.put('/approve-application-by-hall', verifyToken, authorization('hall-provost'), courseApplicationController.approveApplicationByHall)
router.put('/approve-application-by-academic-section', verifyToken, authorization('academic-committee'), courseApplicationController.approveApplicationByAcademicSection)

router.put('/deny-application-by-dept-chairman', verifyToken, authorization('dept-chairman'), courseApplicationController.denyApplicationByDept)
router.put('/deny-application-by-hall', verifyToken, authorization('hall-provost'), courseApplicationController.denyApplicationByHall)
router.put('/deny-application-by-academic-section', verifyToken, authorization('academic-committee'), courseApplicationController.denyApplicationByAcademicSection)







module.exports = router;