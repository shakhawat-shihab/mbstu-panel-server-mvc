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
router.patch('/add-teacher/:userId', verifyToken, userController.addTeacher);
router.patch('/add-dept-chairman/:userId', verifyToken, userController.addDeptChairman);
router.get('/teacher', userController.getTeacherByDept);


module.exports = router;