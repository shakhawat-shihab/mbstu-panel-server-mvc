const Course = require("../models/Courses");

exports.createCourseService = async (data) => {
    const result = await Course.create(data);
    return result;
}