const Course = require("../models/Courses");

exports.createCourseService = async (data) => {
    const result = await Course.create(data);
    return result;
}
exports.getCoursesBySemesterCodeService = async (semesterCode) => {
    const result = await Course.find({ semesterCode });
    return result;
}