const express = require("express");
const hallController = require("../../controllers/hall.controller");
const profileController = require("../../controllers/profile.controller");
const verifyToken = require("../../middleware/verifyToken");
const { handleUpload } = require("../../utils/multer");
// const upload = require("../../utils/multer");
const router = express.Router();



{/* <input name-'image' type='file' /> */ }
// router.put('/update', verifyToken, upload.single('image') , profileController.profileUpdate);
router.put('/update', verifyToken, handleUpload, profileController.profileUpdate);
router.get('/', verifyToken, profileController.profileGet);



module.exports = router;