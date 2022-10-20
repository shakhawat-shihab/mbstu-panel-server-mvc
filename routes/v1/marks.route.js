const express = require("express");
const marksController = require("../../controllers/marks.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.patch('/course-registration', marksController.addStudent)
router.patch('/course-registration/payment-complete', marksController.addPaymentInfo)

router.get('/get-marks/course-teacher/:courseMarksId', marksController.getMarksCourseTeacher);
router.get('/get-marks/second-examineer/:courseMarksId', marksController.getMarksSecondExamineer);
router.get('/get-marks/third-examineer/:courseMarksId', marksController.getMarksCourseTeacher);

router.patch('/update-marks/course-teacher/:courseMarksId', marksController.updateMarksCourseTeacher);
router.patch('/update-marks/second-examineer/:courseMarksId', marksController.updateMarksSecondExamineer);

router.get('/get-marks/exam-committe/:courseMarksId', marksController.getAllMarksOfStudentsOfACourse);


// router.get('/:id', );


module.exports = router;