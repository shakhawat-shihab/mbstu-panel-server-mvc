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

exports.getTypeOfACourseService = async (_id) => {
    const type = await Marks.findOne({ _id }).select('type')
    return type;
}


exports.getMarksCourseTeacherService = async (_id, type = null) => {
    let result;
    if (type == 'theory') {
        result = await Marks.findOne({ _id })
            .select('studentsMarks.id teacher studentsMarks.theoryAttendance studentsMarks.theoryCT1 studentsMarks.theoryCT2 studentsMarks.theoryCT3 studentsMarks.theoryFinal studentsMarks.studentProfileId')
            .populate({ path: 'studentsMarks.studentProfileId', select: 'name ' })
    }
    else {
        result = await Marks.findOne({ _id })
            .select('teacher')
    }
    return result;
}

exports.getMarksSecondExamineerService = async (_id) => {
    // console.log(data);
    let result;
    // if (type == 'theory') {
    result = await Marks.findOne({ _id })
        .select('studentsMarks.id secondExamineer studentsMarks.theorySecondExamineer studentsMarks.studentProfileId')
        .populate({ path: 'studentsMarks.studentProfileId', select: 'name' })
    // }
    return result;
}

exports.updateMarksFromSemesterUpdate = async (id, info) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: id }, info);
    return result;
}

exports.updateMarksService = async (id, info) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: id }, { $set: { studentsMarks: info } });
    return result;
}

exports.getAllMarksOfStudentsOfACourseService = async (courseMarksId) => {
    const result = await Marks.findOne({ _id: courseMarksId });
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

