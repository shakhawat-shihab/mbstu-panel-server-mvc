const multer = require("multer");
const path = require("path");

// Multer config
// module.exports = multer({
//   storage: multer.diskStorage({}),
//   fileFilter: (req, file, cb) => {
//     let ext = path.extname(file.originalname);
//     if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
//       cb(new Error("File type is not supported"), false);
//       return;
//     }
//     cb(null, true);
//   },
//   limits: {
//     fileSize: 50000
//   }
// });

const uploader = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    //here file is containing blob bcz of compressjs pacakage
    // var convertedFile = new File([file], "image");
    const supportedFile = /jpg|jpeg|png/
    const extension = path.extname(file.originalname);
    // console.log('file.originalname ', file.originalname)
    // console.log('extension ', extension)
    if (supportedFile.test(extension)) {
      console.log('file ext correct ')
      cb(null, true)
    }
    else {
      console.log('file ext not correct ')
      cb(new Error('Must be a image file.'))
    }
  },
  limits: {
    fileSize: 512000
  }
})



exports.handleUpload = async (req, res, next) => {
  try {
    const upload = uploader.single('image');
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log('multer error = ', err.message)
        return res.status(400).json({
          status: "fail",
          message: "file error occured, FILE size limit 512kb",
          error: err.message,
        });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log('non multer error = ', err.message)
        return res.status(400).json({
          status: "fail",
          message: "can't upload",
          error: err.message,
        });
      }
      next()
    })

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't upload",
      error: error.message,
    });
  }
}
