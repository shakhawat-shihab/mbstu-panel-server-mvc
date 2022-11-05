const express = require("express");
const courseController = require("../../controllers/course.controller");
const authorization = require("../../middleware/authorization");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();

router.post('/create', verifyToken, authorization('dept-chairman'), courseController.createCourse);
router.get('/:semesterCode', verifyToken, authorization('teacher, student, dept-chairman'), courseController.getCoursesBySemesterCode);

module.exports = router;