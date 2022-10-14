const StudentResult = require("../models/StudentResult");

exports.createStudentResultService = async (data) => {
    const result = await StudentResult.create(data);
    return result;
}

exports.getStudentOfPreviousSemesterService = async (semesterCode) => {
    // const result = await StudentResult.find({ semesterCode: 1 }).select('id').populate({ path: 'studentProfile', select: 'name' });
    const result = await StudentResult.find({ semesterCode: semesterCode }).select('studentProfile id')
    return result;
}