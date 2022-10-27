const { createProjectApplicationService, getProjectCoursesService } = require("../services/projectApplication.service");

exports.createProjectApplication = async (req, res, next) => {
    try {
        const application = await createProjectApplicationService(req.body)
        res.status(200).json({
            status: "success",
            message: "applied supervisor successfully!",
            data: application,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to apply to supervisor",
            error: error.message,
        });
    }
}

exports.getProjectCourses = async (req, res, next) => {
    try {
        const { profileId } = req.params
        const { department } = req.params
        const courses = await getProjectCoursesService(profileId, department)
        res.status(200).json({
            status: "success",
            message: "project courses loaded successfully!",
            data: courses,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load project courses",
            error: error.message,
        });
    }
}
