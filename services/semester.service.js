const Marks = require("../models/Marks");
const Semester = require("../models/Semester");

exports.createSemesterService = async (data) => {
    const result = await Semester.create(data);
    return result;
}

exports.findSemesterService = async (filters) => {
    const { semesterCode, session } = filters;
    const result = await Semester.findOne({ semesterCode, session });
    return result;
}

exports.updateSemesterService = async (id, semester) => {
    const result = await Semester.updateOne({ _id: id }, { $set: semester });
    return result;
}
// exports.getStudentsWithCoursesService = async (semesterId) => {
//     // const result = await Semester.find({ _id: semesterId }).select('studentCourses').populate({ path: 'studentCourses.studentId', select: 'id name' });
//     const result = await Semester.find({ _id: semesterId }).select('studentsCourses')
//         .populate({ path: 'studentsCourses.studentProfileId', select: 'id name' })
//         .populate({ path: 'studentsCourses.coursesMarksList', select: 'courseTitle -_id courseCode' })
//     return result;
// }
exports.getCoursesPreviousRunningSemesterService = async (semesterCode) => {
    // const result = await Semester.find({ _id: semesterId }).select('studentCourses').populate({ path: 'studentCourses.studentId', select: 'id name' });
    const result = await Semester.find({ semesterCode: { $lt: semesterCode }, isRunning: true }).select('courses')
        .populate({ path: 'courses', select: 'courseTitle _id courseCode' })
    // .populate({ path: 'studentsCourses.coursesMarksList', select: 'courseTitle -_id courseCode' })
    return result;
}

exports.getMarksOfCurrentSemesterService = async (semesterId) => {
    // const result = await Semester.find({ _id: semesterId }).select('studentCourses').populate({ path: 'studentCourses.studentId', select: 'id name' });
    const semester = await Semester.findOne({ _id: semesterId })
    // console.log(semester.courses)
    const marks = await Marks.find({
        "_id": {
            $in: semester.courses
        }
    })
    const mark = await Marks.aggregate([
        {
            $match: {
                "_id": {
                    $in: semester.courses
                }
            }
        },
        {
            $unwind: "$studentsMarks"
        },
        {
            $group: {
                _id: "$studentsMarks.id",
                marksArray: {
                    $push: {
                        courseCode: "$courseCode",
                        courseTitle: "$courseTitle",
                        marks: "$studentsMarks.theoryFinal"
                    }
                }
            }
        }
    ])
    return mark;
}