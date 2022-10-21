const { createCourseService } = require("../services/course.service");

exports.createCourse = async (req, res, next) => {
    try {
        const users = await createCourseService(req.body)
        res.status(200).json({
            status: "success",
            messgae: "Data loaded successfully!",
            data: users,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: " Data failed to load ",
            error: error.message,
        });
    }
}