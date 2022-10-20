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
    // const mark = await Marks.aggregate([
    //     {
    //         $match: {
    //             "_id": {
    //                 $in: semester.courses
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 1,
    //             courseTitle: 1,
    //             teacher: 1,
    //             studentsMarks: 1
    //         }
    //     },
    //     // //stage 1
    //     // { $in: courses },
    //     // //stage 2
    //     // {
    //     //     $project: {
    //     //         store: 1,
    //     //         price: { $convert: { input: '$price', to: 'int' } },
    //     //         quantity: 1
    //     //     }
    //     // },
    //     // //stage 3
    //     // { $group: { _id: _id, totalProductsPrice: { $sum: { $multiply: ['$price', '$quantity'] } } } }
    //     { $group: { _id: '$studentsMarks.studentProfileId', totalProductsPrice: { $sum: '$theoryFinal' } } }
    // ])

    return marks;
}