const express = require("express");
const studentResultController = require("../../controllers/studentResult.controller");
const authorization = require("../../middleware/authorization");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.get('/get-semester-code', verifyToken, authorization('student, teacher'), studentResultController.getStudentSemesterCode);
router.put('/publish-result', verifyToken, authorization('teacher'), studentResultController.publishResult);
router.get('/:studentProfileId', authorization('teacher, student, dept-chairman, hall-provost, academic-committee'), studentResultController.getStudentResult);

module.exports = router;