const express = require("express");
const projectApplicationController = require("../../controllers/projectApplication.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.post('/create', projectApplicationController.createProjectApplication)
router.get('/find-project-course', verifyToken, projectApplicationController.getProjectCourses)
router.get('/my-proposal/:courseId', verifyToken, projectApplicationController.getMyProposalForACourse)



module.exports = router;