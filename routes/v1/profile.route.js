const express = require("express");
const hallController = require("../../controllers/hall.controller");
const verifyToken = require("../../middleware/verifyToken");
const Profile = require("../../models/Profile");
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");
const router = express.Router();



{/* <input name-'image' type='file' /> */ }
router.post('/create', upload.single('image'), async (req, res, next) => {
    try {
        console.log('inside')
        const user = req.user;
        const data = req.body;
        //check if the user is the hall provost

        const result = await cloudinary.uploader.upload(req.file.path)

        let prof = new Profile({
            imageURL: result.secure_url,
        });
        // Save user
        await prof.save();


        console.log(prof)

        res.status(200).json({
            status: "success",
            message: "success",
            data: result,
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Fail",
            error: error.message,
        });
    }
}


);



module.exports = router;