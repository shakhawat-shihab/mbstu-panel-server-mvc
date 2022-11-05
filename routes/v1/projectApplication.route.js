const express = require("express");
const projectApplicationController = require("../../controllers/projectApplication.controller");
const authorization = require("../../middleware/authorization");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.post('/create', verifyToken, authorization('student'), projectApplicationController.createProjectApplication)
router.get('/find-project-course', verifyToken, authorization('student'), projectApplicationController.getProjectCourses)
router.get('/my-proposal/:courseId', verifyToken, authorization('student'), projectApplicationController.getMyProposalForACourse)
router.get('/proposal-for-teacher/:courseId', verifyToken, authorization('teacher'), projectApplicationController.getProposalToTeacherForACourse)
router.put('/approve-proposal/:proposalId', verifyToken, authorization('teacher'), projectApplicationController.updateProposalToApprove)
router.put('/deny-proposal/:proposalId', verifyToken, authorization('teacher'), projectApplicationController.updateProposalToDeny)
router.get('/check-any-accepted/:courseId', verifyToken, authorization('student'), projectApplicationController.getAcceptedProposal)



module.exports = router;