const express = require("express");
const userController = require("../../controllers/user.controller");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();

router.get('/', userController.getUser);
router.get("/signup/confirmation/:token", userController.confirmEmail);
router.post('/signup', userController.signUp);
router.post('/login', userController.logIn);
router.get('/me', verifyToken, userController.getMe);
router.get('/email/:email', userController.findUserLikeEmail);

router.put('/add-teacher/:userId', verifyToken, userController.addTeacher);

router.get('/find-dept-chairman/:department', verifyToken, userController.getDeptChairman);
router.put('/add-dept-chairman/:department/:userId', verifyToken, userController.addDeptChairman);

router.put('/add-hall-provost', verifyToken, userController.addHallProvost);

router.put('/add-academic-committee/:userId', verifyToken, userController.addAcademicCommittee);
router.put('/remove-academic-committee/:userId', verifyToken, userController.removeAcademicCommittee);


router.get('/teacher', userController.getTeacherByDept);


module.exports = router;