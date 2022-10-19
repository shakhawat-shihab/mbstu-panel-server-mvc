const express = require("express");
const marksController = require("../../controllers/marks.controller");

const router = express.Router();

router.patch('/course-registration', marksController.addStudent)
router.patch('/course-registration/payment-complete', marksController.addPaymentInfo)

router.get('/get-marks/course-teacher/:courseMarksId', marksController.getMarksCourseTeacher);
router.patch('/update-marks/course-teacher/:courseMarksId', marksController.updateMarksCourseTeacher);

// router.get('/get-marks/course-teacher/:id', marksController.getMarks);


// router.get('/:id', );


module.exports = router;