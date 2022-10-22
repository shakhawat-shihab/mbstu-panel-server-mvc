const { createCourseService, getCoursesBySemesterCodeService } = require("../services/course.service");

exports.createCourse = async (req, res, next) => {
    try {
        const course = await createCourseService(req.body)
        res.status(200).json({
            status: "success",
            message: "course created successfully!",
            data: course,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to create ",
            error: error.message,
        });
    }
}

exports.getCoursesBySemesterCode = async (req, res, next) => {
    try {
        const { semesterCode } = req.params
        const courses = await getCoursesBySemesterCodeService(semesterCode)
        res.status(200).json({
            status: "success",
            messgae: "Data loaded successfully!",
            data: courses,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: " Data failed to load ",
            error: error.message,
        });
    }
}