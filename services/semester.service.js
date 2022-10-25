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



exports.getCoursesOfRunningSemesterBySemesterCodeService = async (semesterCode, dept) => {
    const courses = await Semester.findOne({ semesterCode: semesterCode, department: dept, isRunning: true })
        .select('coursesMarks name degree')
        .populate({ path: 'coursesMarks', select: 'courseCode courseTitle credit type teacher semesterId' })
    // console.log(semester.courses)
    return courses;
}

exports.getCoursesPreviousRunningSemesterService = async (semesterCode, dept) => {
    // console.log(semesterCode, dept);
    const result = await Semester.aggregate([
        { $match: { semesterCode: { $lt: parseInt(semesterCode) }, department: dept, isRunning: true } },
        { $lookup: { from: 'marks', localField: 'coursesMarks', foreignField: '_id', as: 'course' } },
        {
            $project: {
                'course': 1,
                '_id': 0
            }
        },
        { $unwind: "$course" },
        {
            $project: {
                'course.courseCode': 1,
                'course.courseTitle': 1,
                'course.credit': 1,
                'course.teacher': 1,
                'course.semesterId': 1,
                'course._id': 1,
                'course.type': 1,
            }
        },

    ])
    return result;
}



//need a lot of modification here
exports.getMarksOfCurrentSemesterService = async (semesterId) => {
    const result = await Semester.findOne({ _id: semesterId }).select('coursesMarks examCommittee examCommitteeChairman ').populate({ path: 'coursesMarks' });
    // const semester = await Semester.findOne({ _id: semesterId })
    // console.log(semester.courses)
    // const marks = await Marks.find({
    //     "_id": {
    //         $in: semester.courses
    //     }
    // })
    // const mark = await Marks.aggregate([
    //     {
    //         $match: {
    //             "_id": {
    //                 $in: semester.coursesMarks
    //             }
    //         }
    //     },
    //     {
    //         $unwind: "$studentsMarks"
    //     },
    //     {
    //         $group: {
    //             _id: "$studentsMarks.id",
    //             marksArray: {
    //                 $push: {
    //                     courseCode: "$courseCode",
    //                     courseTitle: "$courseTitle",
    //                     marks: "$studentsMarks.theoryFinal"
    //                 }
    //             }
    //         }
    //     }
    // ])
    return result;
}