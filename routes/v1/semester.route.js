const express = require("express");
const semesterController = require("../../controllers/semester.controller");
const { getStudentOfPreviousSemester } = require("../../controllers/studentResult.controller");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();




router.post('/', semesterController.createSemester);

router.patch('/semester-info/:semesterId', semesterController.updateSemester);
//courseId will be courseMarks ref to marks
router.patch('/semester-course/:courseMarks', semesterController.updateSemesterCourse);
router.get('/courses/:semesterCode', semesterController.getCoursesPreviousRunningSemester);

router.get('/marks-of-all-course/:semesterId', semesterController.getMarksOfCurrentSemester);



module.exports = router;