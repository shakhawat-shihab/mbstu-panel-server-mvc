const Hall = require("../models/Hall");

exports.createHallService = async (data) => {
    const result = await Hall.create(data);
    return result;
}

exports.findStudentInhallService = async (id) => {
    const result = await Hall.findOne({ studentsIds: { $elemMatch: { $eq: id } } });
    return result;
}

exports.insertStudentInhallService = async (studentId, hallId) => {
    // console.log(studentId, hallId)
    const result = await Hall.updateOne({ _id: hallId }, { $addToSet: { studentsIds: studentId } });
    return result;
}

exports.insertStudentInhallByFileService = async (studentIds, hallId) => {
    // console.log(studentId, hallId)
    const result = await Hall.updateOne({ _id: hallId }, { $addToSet: { studentsIds: studentIds } });
    return result;
}

exports.removeStudentFromhallService = async (studentId, hallId) => {
    console.log(studentId, hallId)
    const result = await Hall.updateOne({ _id: hallId }, { $pull: { studentsIds: studentId } });
    return result;
}

exports.getHallsService = async (id) => {
    const result = await Hall.find({}).select('name codeName');
    return result;
}
