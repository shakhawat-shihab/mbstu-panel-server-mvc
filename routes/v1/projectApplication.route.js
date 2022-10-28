const express = require("express");
const projectApplicationController = require("../../controllers/projectApplication.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.post('/create', verifyToken, projectApplicationController.createProjectApplication)
router.get('/find-project-course', verifyToken, projectApplicationController.getProjectCourses)
router.get('/my-proposal/:courseId', verifyToken, projectApplicationController.getMyProposalForACourse)
router.get('/proposal-for-teacher/:courseId', verifyToken, projectApplicationController.getProposalToTeacherForACourse)
router.patch('/approve-proposal/:proposalId', verifyToken, projectApplicationController.updateProposalToApprove)




module.exports = router;