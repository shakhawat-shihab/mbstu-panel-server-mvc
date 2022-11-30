const express = require("express");
const hallController = require("../../controllers/hall.controller");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();

router.post('/create', verifyToken, hallController.createHall);
router.get('/find/:id', hallController.findStudentInhall);
router.put('/insert/:id', verifyToken, hallController.insertStudentInhall);
router.put('/insert-file', verifyToken, hallController.insertStudentInhallByFile);
router.put('/remove/:id', verifyToken, hallController.removeStudentFromhall);
router.get('/get-halls', verifyToken, hallController.getHalls);


module.exports = router;