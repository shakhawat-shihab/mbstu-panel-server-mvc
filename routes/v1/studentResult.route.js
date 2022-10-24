const express = require("express");
const studentResultController = require("../../controllers/studentResult.controller");

const router = express.Router();

router.get('/:studentProfileId', studentResultController.getStudentResult);
router.get('/get-semester-code/:studentProfileId', studentResultController.getStudentSemesterCode);


module.exports = router;