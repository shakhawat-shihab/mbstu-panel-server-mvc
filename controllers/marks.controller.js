exports.updateMarks = async (req, res, next) => {
    try {

        res.status(200).json({
            status: "success",
            message: "Successfully created the Semester",
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to create the Semester",
            error: error.message,
        });
    }
}