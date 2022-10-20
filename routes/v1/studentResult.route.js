const express = require("express");
const studentResultController = require("../../controllers/studentResult.controller");

const router = express.Router();

router.get('/:studentId', studentResultController.getStudentResult);


module.exports = router;