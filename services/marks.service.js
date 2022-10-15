const Marks = require("../models/Marks");


exports.createMarksService = async (data) => {
    const result = await Marks.create(data);
    return result;
}

exports.getCoursesMarksService = async (data) => {
    // console.log(data);
    const result = await Marks.find({ _id: { $in: data.courses } });
    return result;
}

exports.getMarksService = async (_id) => {
    // console.log(data);
    const result = await Marks.findOne({ _id })
    return result;
}

exports.getMarksCourseTeacherService = async (_id) => {
    // console.log(data);
    const result = await Marks.find({ _id }).select('theoryFinal').populate('studentsMarks.studentProfileId');
    // if(result.teacher.teacherprofileId==myId){
    //     //return marks
    // }
    return result;
}

exports.updateMarksFromSemesterUpdate = async (id, info) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: id }, info);
    return result;
}

exports.updateMarksCourseTeacherService = async (id, info) => {
    console.log(id, info)
    const result = await Marks.updateOne({ _id: id }, { $set: { studentsMarks: info } });
    return result;
}
exports.addStudentService = async (data) => {
    // //console.log(data)

    // const result = Marks.updateMany({ _id: { $in: data.courses.map(({ id }) => id) } },
    //     [
    //         { "id": "A", "name": "AA", "arrayField": [1, 2, 3] },
    //         { "id": "B", "name": "BB", "arrayField": [4, 5, 6] },
    //         { "id": "C", "name": "CC", "arrayField": [7, 8] }
    //     ], { upsert: true });
    // console.log(result)
    // // const result = await Marks.updateOne({ _id: id }, info);
    // // return result;
}

