const express = require("express");
const semesterController = require("../../controllers/semester.controller");
const { getStudentOfPreviousSemester } = require("../../controllers/studentResult.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();




router.post('/', semesterController.createSemester);

router.patch('/semester-info/:semesterId', semesterController.updateSemester);
//courseId will be courseMarks ref to marks
router.patch('/semester-course/:courseMarks', semesterController.updateSemesterCourse);

router.get('/courses-previous/:semesterCode', verifyToken, semesterController.getCoursesPreviousRunningSemester);
router.get('/courses-running/:semesterCode', verifyToken, semesterController.getCoursesOfRunningSemesterBySemesterCode)

router.put('/exam-taken-done/:semesterId', verifyToken, semesterController.updateExamTaken)

router.get('/courses/:semesterId', verifyToken, semesterController.getCoursesBySemesterId)

router.get('/marks-of-all-course/:semesterId', verifyToken, semesterController.getMarksOfCurrentSemester);

router.get('/load-running-semester/exam-committee', verifyToken, semesterController.getRunningSemesterByExamCommittee);
router.get('/load-running-semester/exam-committee-chairman', verifyToken, semesterController.getRunningSemesterByExamCommitteeChairman);



module.exports = router;