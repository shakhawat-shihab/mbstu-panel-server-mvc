const express = require("express");
const projectApplicationController = require("../../controllers/projectApplication.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.post('/create', projectApplicationController.createProjectApplication)
router.get('/find-project-course/:profileId/:department', projectApplicationController.getProjectCourses)


module.exports = router;