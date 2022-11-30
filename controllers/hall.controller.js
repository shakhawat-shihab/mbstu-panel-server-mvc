const User = require("../models/User");
const { createHallService, findStudentInhallService, getHallsService, removeStudentFromhallService, insertStudentInhallService, insertStudentInhallByFileService } = require("../services/hall.service");

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

exports.insertStudentInhallByFile = async (req, res, next) => {
    try {
        const studentIds = req.body?.studentIds;
        const hallId = req.user?.hall?.hallId;
        // console.log(hallId)
        // const email = studentId + '@mbstu.ac.bd';

        const studentIdsLower = []
        studentIds.forEach(x => {
            studentIdsLower.push(x?.toLowerCase()?.trim() + '@mbstu.ac.bd');
        })
        // console.log('studentIdsLower ==> ', studentIdsLower)

        const student = await User.find({ email: { $in: studentIdsLower } }).populate('profile');
        console.log('student ==> ', student);

        const studentToAdd = []

        //jsb student er sate kono hall er info nai tader k add korte hbe.......
        studentIdsLower.forEach(element => {
            let found = false;
            student.forEach(s => {
                if (s?.email == element || s?.hall?.hallId) {
                    console.log('paisiiiiiiiiiiiiiiiii ', element)
                    found = true;
                }
            })
            if (!found) {
                studentToAdd.push(element.substring(0, element.length - 12))
            }
        });

        console.log('studentToAdd ==> ', studentToAdd);


        if (!hallId) {
            return res.status(400).json({
                status: "fail",
                message: "You are not hall provost.",
            });
        }


        const result = await insertStudentInhallByFileService(studentToAdd, hallId);

        res.status(200).json({
            status: "success",
            message: "added student to hall successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add student in hall",
            error: error.message,
        });
    }
}


exports.insertStudentInhall = async (req, res, next) => {
    try {
        const studentId = req.params?.id?.toLowerCase()?.trim();
        const hallId = req.user?.hall?.hallId;
        const email = studentId + '@mbstu.ac.bd';
        const student = User.findOne({ email: email });

        if (!hallId) {
            return res.status(400).json({
                status: "fail",
                message: "You are not hall provost.",
            });
        }

        // if (student?.hall?.hallId) {
        //     return res.status(400).json({
        //         status: "fail",
        //         message: "The student is already in a hall.",
        //     });
        // }

        if (student?.hall?.hallId && student?.hall?.hallId != req?.user?.hall?.hallId) {
            return res.status(400).json({
                status: "fail",
                message: "You are not authorized to modify the student of another hall.",
            });
        }

        const result = await insertStudentInhallService(studentId, hallId);

        res.status(200).json({
            status: "success",
            message: "added student to hall successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add student in hall",
            error: error.message,
        });
    }
}


exports.removeStudentFromhall = async (req, res, next) => {
    try {
        const studentId = req.params.id.toLowerCase().trim();
        const hallId = req.user?.hall?.hallId;
        const email = studentId + '@mbstu.ac.bd';
        const student = User.findOne({ email: email });

        if (!hallId) {
            return res.status(400).json({
                status: "fail",
                message: "You are not hall provost.",
            });
        }

        // console.log(student?.hall?.hallId, req?.user?.hall?.hallId)
        if (student?.hall?.hallId && student?.hall?.hallId != req?.user?.hall?.hallId) {
            return res.status(400).json({
                status: "fail",
                message: "You are not authorized to modify the student of another hall.",
            });
        }

        const result = await removeStudentFromhallService(studentId, hallId);

        res.status(200).json({
            status: "success",
            message: "Removed student to hall successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to remove student in hall",
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

exports.getHalls = async (req, res, next) => {
    try {
        const halls = await getHallsService();
        res.status(200).json({
            status: "success",
            message: "loaded  halls successfully",
            data: halls,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load  halls",
            error: error.message,
        });
    }
}