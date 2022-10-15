const e = require("express");
const { getCoursesMarksService, getMarksCourseTeacherService, updateMarksCourseTeacherService, getMarksService } = require("../services/marks.service");




exports.getMarksCourseTeacher = async (req, res, next) => {
    try {
        //marks gula load korea ante hbe
        console.log(req.params.id)
        const marksOfACourse = await getMarksCourseTeacherService(req.params.id)
        res.status(200).json({
            status: "success",
            message: "Successfully created the Semester",
            data: marksOfACourse
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to create the Semester",
            error: error.message,
        });
    }
}



exports.updateMarksCourseTeacher = async (req, res, next) => {
    try {
        //marks gula load korea ante hbe
        const { courseMarksId } = req.params;
        const allmarksOfACourse = await getMarksService(courseMarksId);

        const updatedData = allmarksOfACourse.studentsMarks.map((student) => {
            const inputObject = req.body.marks.find(x => {
                return x.id == student.id
            })
            if (inputObject?.[`${req.body.propertyName}`]) {
                student[`${req.body.propertyName}`] = inputObject[`${req.body.propertyName}`]
            }
            return student;
        })
        console.log(updatedData)
        const result = await updateMarksCourseTeacherService(courseMarksId, updatedData)

        res.status(200).json({
            status: "success",
            message: "Successfully added marks",
            data: result
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add marks",
            error: error.message,
        });
    }
}

// addStudent will call when chairman approve an application
exports.addStudent = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await getCoursesMarksService(data)
        // console.log('result ', result);
        let results = result.map(async (course) => {
            let found = false;
            course.studentsMarks.map(async (student) => {
                if (student.studentProfileId == data.studentProfileId) {
                    found = true;
                    return;
                }
            })
            if (found == false) {
                // push the student to that course
                console.log('not found me on ', course.courseCode);
                course.setStudent({ id: data.id, studentProfileId: data.studentProfileId })
                await course.save({ validateBeforeSave: false })
            }
        })
        await Promise.all(results)
        return res.status(200).json({
            status: "success",
            message: "Successfully added student and their taken courses",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add student and their taken courses",
            error: error.message,
        });
    }
}

// addPaymentInfo will call when academic section verfiy a payment and approve the application
exports.addPaymentInfo = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await getCoursesMarksService(data)
        // console.log('result ', result);
        let results = result.map(async (course) => {
            let index = 0;
            course.studentsMarks.map(async (student) => {
                if (student.studentProfileId == data.studentProfileId) {
                    course.setPayment(index)
                    const r = await course.save({ validateBeforeSave: false })
                    // console.log('r ', r)
                }
                index += 1;
            })
        })
        await Promise.all(results)
        return res.status(200).json({
            status: "success",
            message: "Successfully update this student's payment info ",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to update this student's payment info",
            error: error.message,
        });
    }
}