const express = require("express");
const studentResultController = require("../../controllers/studentResult.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.get('/:studentProfileId', studentResultController.getStudentResult);
router.get('/get-semester-code/:studentProfileId', studentResultController.getStudentSemesterCode);

router.put('/publish-result', verifyToken, studentResultController.publishResult);


module.exports = router;