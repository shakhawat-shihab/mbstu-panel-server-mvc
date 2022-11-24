const express = require("express");
const hallController = require("../../controllers/hall.controller");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();

router.post('/create', hallController.createHall);
router.get('/find/:id', hallController.findStudentInhall);
router.get('/get-halls', hallController.getHalls);


module.exports = router;