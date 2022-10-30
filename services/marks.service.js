const Marks = require("../models/Marks");
// const mongoose = require('mongoose')
// const { ObjectId } = mongoose.Schema.Types;

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
            .select('studentsMarks.id teacher type courseTitle courseCode credit isSubmittedByCourseTeacher studentsMarks.theoryAttendance studentsMarks.theoryCT1 studentsMarks.theoryCT2 studentsMarks.theoryCT3 studentsMarks.theoryFinal studentsMarks.studentProfileId')
            .populate({ path: 'studentsMarks.studentProfileId', select: 'firstName lastName ' })
            .populate({ path: 'semesterId', select: 'semesterCode' })

    }
    else if (type == 'lab') {
        result = await Marks.findOne({ _id })
            .select('studentsMarks.id teacher type courseTitle courseCode credit isSubmittedByCourseTeacher   studentsMarks.labAttendance studentsMarks.labReport studentsMarks.labQuiz studentsMarks.labExperiment  studentsMarks.studentProfileId')
            .populate({ path: 'studentsMarks.studentProfileId', select: 'firstName lastName ' })
            .populate({ path: 'semesterId', select: 'semesterCode' })
    }

    else if (type == 'project') {
        result = await Marks.findOne({ _id })
            .select('studentsMarks.id teacherList isSubmittedByProjectTeacher teacherStudentMap type courseTitle courseCode credit isSubmittedByCourseTeacher isSubmittedBySecondExaminer  isSubmittedByThirdExamier studentsMarks.projectClassPerformance  studentsMarks.studentProfileId')
            .populate({ path: 'studentsMarks.studentProfileId', select: 'firstName lastName ' })
            .populate({ path: 'semesterId', select: 'semesterCode' })
    }

    return result;
}

exports.getMarksSecondExaminerService = async (_id) => {
    // console.log(data);
    let result;
    // if (type == 'theory') {
    result = await Marks.findOne({ _id })
        .select('studentsMarks.id secondExaminer type courseTitle courseCode credit isSubmittedByCourseTeacher  isSubmittedBySecondExaminer studentsMarks.theorySecondExaminer studentsMarks.studentProfileId')
        .populate({ path: 'studentsMarks.studentProfileId', select: 'firstName lastName ' })
        .populate({ path: 'semesterId', select: 'semesterCode' })
    // }
    return result;
}

exports.getMarksThirdExaminerService = async (_id) => {
    // console.log(data);
    let result;
    result = await Marks.findOne({ _id })
        .select('studentsMarks.id thirdExaminer type courseTitle courseCode credit isSubmittedByCourseTeacher isSubmittedBySecondExaminer  isSubmittedByThirdExamier studentsMarks.theoryFinal studentsMarks.theorySecondExaminer studentsMarks.theoryThirdExaminer studentsMarks.studentProfileId studentsMarks.isPaid ')
        .populate({ path: 'studentsMarks.studentProfileId', select: 'firstName lastName ' })
        .populate({ path: 'semesterId', select: 'semesterCode' })
    // console.log(result);
    const newArrayOfStudentsMarks = result.studentsMarks;
    result.studentsMarks = []
    const output = newArrayOfStudentsMarks.map(x => {
        let second = 0
        let first = 0
        x?.theoryFinal && (first = parseInt(x.theoryFinal))
        x?.theorySecondExaminer && (second = parseInt(x.theorySecondExaminer))
        if (Math.abs(first - second) > 15) {
            // console.log('x ================== ', x);
            let { theorySecondExaminer, theoryFinal, studentProfileId, theoryThirdExaminer, isPaid, id } = x;
            const obj = { id, studentProfileId, isPaid, theoryThirdExaminer }
            result.studentsMarks.push(obj);
        }
    })
    return result;
}

exports.updateMarksFromSemesterUpdate = async (id, info) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: id }, info);
    return result;
}

exports.turnInMarksCourseTeacherService = async (courseId) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: courseId }, { $set: { isSubmittedByCourseTeacher: true } });
    return result;
}

exports.turnInMarksSecondExaminerService = async (courseId) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: courseId }, { $set: { isSubmittedBySecondExaminer: true } });
    return result;
}

exports.turnInMarksThirdExaminerService = async (courseId) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: courseId }, { $set: { isSubmittedByThirdExamier: true } });
    return result;
}

exports.turnInMarksProjectTeacherService = async (courseId, profileId) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: courseId }, { $addToSet: { isSubmittedByProjectTeacher: profileId } });
    return result;
}

exports.updateMarksService = async (id, info) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: id }, { $set: { studentsMarks: info } });
    return result;
}

exports.getAllMarksOfStudentsOfACourseService = async (courseMarksId) => {
    const result = await Marks.findOne({ _id: courseMarksId })
        .populate({ path: 'semesterId', select: 'examCommittee examCommitteeChairman' })
        .populate({ path: 'studentsMarks.studentProfileId', select: 'firstName lastName ' })
    return result;
}

exports.getTakenCoursesService = async (profileId, state) => {
    let result;
    if (state == 1) {
        // result = await Marks.find({ 'teacher.teacherProfileId': profileId })
        //     .populate({ path: 'semesterId', select: 'name session' })
        //     .sort('semesterId.session')
        result = await Marks.find({ $or: [{ 'teacher.teacherProfileId': profileId }, { teacherList: { $eq: profileId } }] })
            .populate({ path: 'semesterId', select: 'name session' })
            .sort('semesterId.session')

    }
    else if (state == 2) {
        result = await Marks.find({ 'secondExaminer.teacherProfileId': profileId })
            .populate({ path: 'semesterId', select: 'name session' })
            .sort(-'semesterId.semesterCode')
    }
    else if (state == 3) {
        result = await Marks.find({ 'thirdExaminer.teacherProfileId': profileId })
            .populate({ path: 'semesterId', select: 'name session' })
            .sort(-'semesterId.semesterCode')
    }
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


exports.getTeachersForACourseService = async (courseId) => {
    const teachers = Marks.findOne({ _id: courseId })
        .select('courseCode courseTitle credit type teacherList')
        .populate({ path: 'teacherList' })
    // console.log(teachers);
    return teachers
}