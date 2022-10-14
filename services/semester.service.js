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
exports.getStudentsWithCoursesService = async (semesterId) => {
    // const result = await Semester.find({ _id: semesterId }).select('studentCourses').populate({ path: 'studentCourses.studentId', select: 'id name' });
    const result = await Semester.find({ _id: semesterId }).select('studentsCourses')
        .populate({ path: 'studentsCourses.studentId', select: 'id name' })
        .populate({ path: 'studentsCourses.coursesMarksList', select: 'courseTitle -_id courseCode' })
    return result;
}