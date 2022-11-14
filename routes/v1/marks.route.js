const express = require("express");
const marksController = require("../../controllers/marks.controller");
const authorization = require("../../middleware/authorization");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.patch('/course-registration', marksController.addStudent)
router.patch('/course-registration/payment-complete', marksController.addPaymentInfo)

router.get('/get-marks/course-teacher/:courseMarksId', verifyToken, authorization('teacher'), marksController.getMarksCourseTeacher);
router.get('/get-marks/second-examiner/:courseMarksId', verifyToken, authorization('teacher'), marksController.getMarksSecondExaminer);
router.get('/get-marks/third-examiner/:courseMarksId', verifyToken, authorization('teacher'), marksController.getMarksThirdExaminer);

router.put('/update-marks/course-teacher/:courseMarksId', verifyToken, authorization('teacher'), marksController.updateMarksCourseTeacher);
router.put('/update-marks/second-examiner/:courseMarksId', verifyToken, authorization('teacher'), marksController.updateMarksSecondExaminer);
router.put('/update-marks/third-examiner/:courseMarksId', verifyToken, authorization('teacher'), marksController.updateMarksThirdExaminer);

router.put('/turn-in/course-teacher/:courseMarksId', verifyToken, authorization('teacher'), marksController.turnInMarksCourseTeacher);
router.put('/turn-in/second-examiner/:courseMarksId', verifyToken, authorization('teacher'), marksController.turnInMarksSecondExaminer);
router.put('/turn-in/third-examiner/:courseMarksId', verifyToken, authorization('teacher'), marksController.turnInMarksThirdExaminer);

router.put('/turn-in/project-teacher/:courseMarksId', verifyToken, authorization('teacher'), marksController.turnInMarksProjectTeacher);


router.get('/get-marks/exam-committe/:courseMarksId', verifyToken, authorization('teacher'), marksController.getAllMarksOfStudentsOfACourse);
router.put('/update-marks/exam-committe/:courseMarksId', verifyToken, authorization('teacher'), marksController.updateMarksExamCommittee);

// state=1 (course Teacher)   //state=2 second examineer   //state=3 (third examineer)
router.get('/taken-courses/:profileId/:state', verifyToken, authorization('teacher'), marksController.getTakenCourses);
router.get('/load-teacher/:courseId', verifyToken, authorization('teacher, student'), marksController.getTeachersForACourse)

// router.get('/:id', );


module.exports = router;