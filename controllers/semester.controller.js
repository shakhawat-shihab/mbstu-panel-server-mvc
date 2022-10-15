const Marks = require("../models/Marks");
const { updateMarksFromSemesterUpdate, createMarksService } = require("../services/marks.service");
const { createSemesterService, findSemesterService, updateSemesterService, getCoursesPreviousRunningSemesterService } = require("../services/semester.service");
const { getStudentOfPreviousSemesterService } = require("../services/studentsResult.service");


exports.createSemester = async (req, res, next) => {
    try {
        const { courses, ...otherInfo } = req.body;

        // 1
        const findSemesterResult = await findSemesterService({ semesterCode: otherInfo.semesterCode, session: otherInfo.session })

        //2
        if (findSemesterResult) {
            return res.status(400).json({
                status: "fail",
                message: `This semester is already created for session ${req?.body?.session}`,
            });
        }

        //3
        // create semester
        const semester = await createSemesterService(otherInfo);

        //4
        //add previous semester students
        const studentProfileIds = await getStudentOfPreviousSemesterService(req?.body?.semesterCode - 1);
        // console.log('studentProfileIds  ', studentProfileIds);
        // const previousSemesterStudentsWithCourse = []
        let previousSemesterStudents = []
        studentProfileIds.map(x => {
            const obj = {}
            obj.id = x.id
            obj.studentProfileId = x.studentProfile;
            previousSemesterStudents.push(obj)
            // obj.coursesMarksList = [...arrOfCoursesObjectId];
            // previousSemesterStudentsWithCourse.push(obj);
            // console.log('obj ', obj);
        })


        //5
        // add courses of the semester
        const arrOfCoursesObjectId = []
        let results = courses.map(async (x) => {
            x.semesterId = semester._id;
            x.teacherProfileId = req.body.teacher;
            x.studentsMarks = previousSemesterStudents;
            const result = await createMarksService(x);
            //const { courseCode, courseTitle, teacher, _id: courseMarksId } = result;
            // const obj = { courseCode, courseTitle, teacher, courseMarks }
            // console.log('obj === ', obj)
            arrOfCoursesObjectId.push(result?._id);
        })
        results = await Promise.all(results)


        // //6
        // // add course code to each of the students of previous semester
        // previousSemesterStudents = previousSemesterStudents.map(obj => ({ ...obj, coursesMarksList: [...arrOfCoursesObjectId] }))
        // // console.log(previousSemesterStudents)


        //7
        const data = { courses: [...arrOfCoursesObjectId] }
        semester.setCoursesAndStudentsCourses(data)
        await semester.save({ validateBeforeSave: false });

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

// exports.getStudentsWithCourses = async (req, res, next) => {
//     try {
//         const { semesterId } = req.params;
//         const result = await getStudentsWithCoursesService(semesterId);
//         return res.status(200).json({
//             status: "success",
//             message: "Successfully loaded student and their taken courses",
//             data: result
//         });
//     } catch (error) {
//         res.status(400).json({
//             status: "fail",
//             message: "Failed to load student and their taken courses",
//             error: error.message,
//         });
//     }
// }


exports.getCoursesPreviousRunningSemester = async (req, res, next) => {
    try {
        const { semesterCode } = req.params;
        const result = await getCoursesPreviousRunningSemesterService(semesterCode);
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



