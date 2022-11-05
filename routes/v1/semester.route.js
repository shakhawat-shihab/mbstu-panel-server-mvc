const express = require("express");
const semesterController = require("../../controllers/semester.controller");
const { getStudentOfPreviousSemester } = require("../../controllers/studentResult.controller");
const authorization = require("../../middleware/authorization");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();




router.post('/', verifyToken, authorization('dept-chairman'), semesterController.createSemester);

router.patch('/semester-info/:semesterId', authorization('dept-chairman'), semesterController.updateSemester);
//courseId will be courseMarks ref to marks
router.patch('/semester-course/:courseMarks', semesterController.updateSemesterCourse);

router.get('/courses-previous/:semesterCode', verifyToken, authorization('student,teacher,dept-chairman'), semesterController.getCoursesPreviousRunningSemester);
router.get('/courses-running/:semesterCode', verifyToken, authorization('student,teacher,dept-chairman'), semesterController.getCoursesOfRunningSemesterBySemesterCode)

router.put('/exam-taken-done/:semesterId', verifyToken, authorization('teacher'), semesterController.updateExamTaken)

router.get('/courses/:semesterId', verifyToken, authorization('student,teacher,dept-chairman'), semesterController.getCoursesBySemesterId)

router.get('/marks-of-all-course/:semesterId', verifyToken, authorization('teacher,dept-chairman'), semesterController.getMarksOfCurrentSemester);

router.get('/load-running-semester/exam-committee', verifyToken, authorization('teacher'), semesterController.getRunningSemesterByExamCommittee);
router.get('/load-running-semester/exam-committee-chairman', verifyToken, authorization('teacher'), semesterController.getRunningSemesterByExamCommitteeChairman);



module.exports = router;