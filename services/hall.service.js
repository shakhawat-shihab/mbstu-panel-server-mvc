const Hall = require("../models/Hall");

exports.createHallService = async (data) => {
    const result = await Hall.create(data);
    return result;
}

exports.findStudentInhallService = async (id) => {
    const result = await Hall.findOne({ studentsIds: { $elemMatch: { $eq: id } } });
    return result;
}

exports.getHallsService = async (id) => {
    const result = await Hall.find({}).select('name codeName');
    return result;
}
