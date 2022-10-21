const express = require("express");
const courseController = require("../../controllers/course.controller");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();

router.post('/create', courseController.createCourse);
// router.post('/update', courseController.updateCourse);

module.exports = router;