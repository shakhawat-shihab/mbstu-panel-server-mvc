const { createCourseApplicationService, getTotalCreditTakenService, getApplicationForADepartmentService, getApplicationForAcademicService, getApplicationForAHallService } = require("../services/courseApplication.service");



exports.createCourseApplication = async (req, res, next) => {
    try {
        const application = await createCourseApplicationService(req.body)
        res.status(200).json({
            status: "success",
            message: "application created successfully!",
            data: application,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to create application",
            error: error.message,
        });
    }
}

exports.getTotalCreditTaken = async (req, res, next) => {
    try {
        const { profileId } = req.params;
        const totalCredit = await getTotalCreditTakenService(profileId);
        res.status(200).json({
            status: "success",
            message: "loaded successfully!",
            data: totalCredit,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to loadn",
            error: error.message,
        });
    }
}

exports.getApplicationForADepartment = async (req, res, next) => {
    try {
        const user = req.user;
        const applications = await getApplicationForADepartmentService(user?.department);
        res.status(200).json({
            status: "success",
            message: "Applications loaded successfully!",
            data: applications,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}

exports.getApplicationForAHall = async (req, res, next) => {
    try {
        const user = req.user;
        const applications = await getApplicationForAHallService(user?.hall?.hallId);
        res.status(200).json({
            status: "success",
            message: "Applications loaded successfully!",
            data: applications,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}

exports.getApplicationForAcademic = async (req, res, next) => {
    try {
        const user = req.user;
        const applications = await getApplicationForAcademicService();
        res.status(200).json({
            status: "success",
            message: "Applications loaded successfully!",
            data: applications,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}
