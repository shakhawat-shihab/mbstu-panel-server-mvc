const { getStudentsWithCoursesService } = require("../services/semester.service");

exports.updateMarks = async (req, res, next) => {
    try {
        const marks = await getStudentsWithCoursesService(req.params.id);

        //marks gula load korea ante hbe

        res.status(200).json({
            status: "success",
            message: "Successfully created the Semester",
            data: marks
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to create the Semester",
            error: error.message,
        });
    }
}