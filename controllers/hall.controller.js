const { createHallService, findStudentInhallService } = require("../services/hall.service");

exports.createHall = async (req, res, next) => {
    try {
        const hall = await createHallService(req.body)
        res.status(200).json({
            status: "success",
            message: "hall created successfully!",
            data: hall,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to create hall",
            error: error.message,
        });
    }
}
exports.findStudentInhall = async (req, res, next) => {
    try {
        const hall = await findStudentInhallService(req.params.id)
        res.status(200).json({
            status: "success",
            message: "loaded student's hall successfully",
            data: hall,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load student's hall",
            error: error.message,
        });
    }
}