const Profile = require("../models/Profile");
const cloudinary = require("../utils/cloudinary");

exports.profileUpdate = async (req, res, next) => {
    try {
        // console.log('user ', req.user)
        // console.log(' req.body ', req.body)
        const user = req.user;
        const data = req.body;


        let imageCloudinary = {};
        //if image is provided, then delete previous image
        if (req?.file?.path) {
            //get the profile info
            const output = await Profile.findOne({ _id: user?.profileId })
            //if image exist then remove it
            if (output?.imageURL) {

                // "array splitted by  '/' "
                const array = output?.imageURL.split('/')

                // "folder name/cloudinary_id.extension"
                cloudinary_id = array[array.length - 2] + '/' + array[array.length - 1]
                // console.log('with extension  == ', cloudinary_id)

                // "folder name/cloudinary_id"
                cloudinary_id = cloudinary_id?.split('.')[0]
                //console.log('without extension  == ', cloudinary_id);

                const r = await cloudinary.uploader.destroy(cloudinary_id);
                //console.log('r ', r)

            }
            //upload image to cloudinary
            imageCloudinary = await cloudinary.uploader.upload(req.file.path, {
                folder: 'mbstu-panel',
                use_filename: true
            })
            // console.log('imageCloudinary ', imageCloudinary)

        }




        let profile = {
            firstName: data?.firstName,
            lastName: data?.lastName,
            contactNumber: data?.contactNumber,
            imageURL: imageCloudinary?.secure_url,
            address: data?.address,
        };


        // update profile
        const result = await Profile.updateOne({ _id: user?.profileId }, { $set: profile })

        // Save user
        // const result = await profile.save();

        res.status(200).json({
            status: "success",
            message: "successfully updated the profile",
            data: result,
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to update",
            error: error.message,
        });
    }
}

exports.profileGet = async (req, res, next) => {
    try {

        const user = req.user;

        // update profile
        const result = await Profile.findOne({ _id: user?.profileId })

        res.status(200).json({
            status: "success",
            message: "successfully loaded the profile",
            data: result,
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}