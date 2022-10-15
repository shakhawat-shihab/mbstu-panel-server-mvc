const express = require("express");
const marksController = require("../../controllers/marks.controller");

const router = express.Router();

router.patch('/course-registration', marksController.addStudent)

router.get('/update-marks/:id', marksController.updateMarks);


// router.get('/:id', );


module.exports = router;