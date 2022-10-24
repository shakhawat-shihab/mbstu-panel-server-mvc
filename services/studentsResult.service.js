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

exports.getStudentResultService = async (studentProfileId) => {
    // // const result = await StudentResult.find({ semesterCode: 1 }).select('id').populate({ path: 'studentProfile', select: 'name' });
    // const result = await StudentResult.find({ semesterCode: semesterCode }).select('studentProfile id')
    // return result;
}

exports.getStudentSemesterCodeService = async (studentProfileId) => {
    // // const result = await StudentResult.find({ semesterCode: 1 }).select('id').populate({ path: 'studentProfile', select: 'name' });
    console.log(studentProfileId);
    const result = await StudentResult.findOne({ studentProfile: studentProfileId }).select('semesterCode')
    console.log(result);
    return result;
}