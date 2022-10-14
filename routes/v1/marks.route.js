const express = require("express");
const { updateMarks } = require("../../controllers/marks.controller");
const semesterController = require("../../controllers/semester.controller");

const router = express.Router();


router.patch('/course-teacher', updateMarks);


// router.get('/:id', );


module.exports = router;