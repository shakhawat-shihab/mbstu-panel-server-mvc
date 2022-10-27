const { createProjectApplicationService, getProjectCoursesService, getMyProposalForACourseService } = require("../services/projectApplication.service");

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
        const { profileId, department } = req.user;
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

exports.getMyProposalForACourse = async (req, res, next) => {
    try {
        const { profileId, department } = req.user;
        const { courseId } = req.params;
        const application = await getMyProposalForACourseService(profileId, courseId)
        res.status(200).json({
            status: "success",
            message: "Applications loaded successfully!",
            data: application,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load applications.",
            error: error.message,
        });
    }
}


