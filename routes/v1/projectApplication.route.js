const express = require("express");
const projectApplicationController = require("../../controllers/projectApplication.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.post('/create', verifyToken, projectApplicationController.createProjectApplication)
router.get('/find-project-course', verifyToken, projectApplicationController.getProjectCourses)
router.get('/my-proposal/:courseId', verifyToken, projectApplicationController.getMyProposalForACourse)
router.patch('/approve-proposal/:courseId/:studentProfileId', verifyToken, projectApplicationController.updateProposalToApprove)



module.exports = router;