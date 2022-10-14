const Marks = require("../models/Marks");
const { updateMarksFromSemesterUpdate, createMarksService } = require("../services/marks.service");
const { createSemesterService, findSemesterService, updateSemesterService, getStudentsWithCoursesService } = require("../services/semester.service");
const { getStudentOfPreviousSemesterService } = require("../services/studentsResult.service");


exports.createSemester = async (req, res, next) => {
    try {
        // console.log(req.body);
        const findSemesterResult = await findSemesterService(req.body)

        if (findSemesterResult) {
            return res.status(400).json({
                status: "fail",
                message: `This semester is already created for session ${req?.body?.session}`,
            });
        }

        // add courses of the semester
        const { courses, ...otherInfo } = req.body;
        const arrOfCoursesObjectId = []
        const marks = []
        let results = courses.map(async (x) => {
            const result = await createMarksService(x);
            //const { courseCode, courseTitle, teacher, _id: courseMarksId } = result;
            // const obj = { courseCode, courseTitle, teacher, courseMarks }
            // console.log('obj === ', obj)
            arrOfCoursesObjectId.push(result?._id);
            marks.push(result);
        })
        results = await Promise.all(results)


        //add previous semester students
        const studentProfileIds = await getStudentOfPreviousSemesterService(req?.body?.semesterCode - 1);
        // console.log('studentProfileIds  ', studentProfileIds);
        const previousSemesterStudents = []
        studentProfileIds.map(x => {
            const obj = {}
            obj.studentId = x.studentProfile;
            obj.coursesMarksList = [...arrOfCoursesObjectId];
            previousSemesterStudents.push(obj);
            // console.log('obj ', obj);
        })
        const semester = { courses: [...arrOfCoursesObjectId], studentsCourses: [...previousSemesterStudents], ...otherInfo };
        // console.log('semester  ', semester);


        const output = await createSemesterService(semester);


        Marks.setMarks
        await user.save({ validateBeforeSave: false });

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


exports.updateSemester = async (req, res, next) => {
    try {
        const { semesterId } = req.params;
        const result = await updateSemesterService(semesterId, req.body);
        if (result?.modifiedCount) {
            return res.status(200).json({
                status: "success",
                message: "Successfully updated the Semester",
                data: result
            });
        }
        res.status(400).json({
            status: "fail",
            message: "Failed to update the Semester",
        });


    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to update the Semester",
            error: error.message,
        });
    }
}

exports.updateSemesterCourse = async (req, res, next) => {
    try {
        const { courseMarks } = req.params;
        // const result = await Semester.updateOne({ semesterId, 'courses.courseMarks': courseMarks },
        //     {
        //         'courses.$.propertyName': req.body
        //     });
        const result = await updateMarksFromSemesterUpdate(courseMarks, req.body);
        if (result?.modifiedCount) {
            return res.status(200).json({
                status: "success",
                message: "Successfully updated the Semester",
                data: result
            });
        }
        res.status(400).json({
            status: "fail",
            message: "Failed to update the Semester",
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to update the Semester",
            error: error.message,
        });
    }
}

exports.getStudentsWithCourses = async (req, res, next) => {
    try {
        const { semesterId } = req.params;
        const result = await getStudentsWithCoursesService(semesterId);
        return res.status(200).json({
            status: "success",
            message: "Successfully loaded student and their taken courses",
            data: result
        });


    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load student and their taken courses",
            error: error.message,
        });
    }
}


