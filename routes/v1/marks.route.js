const express = require("express");
const marksController = require("../../controllers/marks.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.patch('/course-registration', marksController.addStudent)
router.patch('/course-registration/payment-complete', marksController.addPaymentInfo)

router.get('/get-marks/course-teacher/:courseMarksId', verifyToken, marksController.getMarksCourseTeacher);
router.get('/get-marks/second-examineer/:courseMarksId', verifyToken, marksController.getMarksSecondExamineer);
router.get('/get-marks/third-examineer/:courseMarksId', marksController.getMarksCourseTeacher);  // korte hobe

router.patch('/update-marks/course-teacher/:courseMarksId', verifyToken, marksController.updateMarksCourseTeacher);
router.patch('/update-marks/second-examineer/:courseMarksId', verifyToken, marksController.updateMarksSecondExamineer);

router.get('/get-marks/exam-committe/:courseMarksId', verifyToken, marksController.getAllMarksOfStudentsOfACourse);
router.patch('/update-marks/exam-committe/:courseMarksId', verifyToken, marksController.updateMarksExamCommittee); //  // korte hobe

// state=1 (course Teacher)   //state=2 second examineer   //state=3 (third examineer)
router.get('/taken-courses/:profileId/:state', marksController.getTakenCourses);


// router.get('/:id', );


module.exports = router;