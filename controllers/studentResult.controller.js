const { getStudentOfPreviousSemesterService, getStudentResultService } = require("../services/studentsResult.service");

exports.getStudentOfPreviousSemester = async (req, res, next) => {
    try {
        const result = await getStudentOfPreviousSemesterService(req.params.semesterCode)
        res.status(400).json({
            status: "fail",
            message: "successfully loaded",
            result: result
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}

exports.getStudentResult = async (req, res, next) => {
    try {
        const data = await getStudentResultService(req.params.studentId)
        res.status(400).json({
            status: "fail",
            message: "successfully loaded",
            result: data
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}