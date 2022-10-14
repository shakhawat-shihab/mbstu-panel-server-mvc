const Marks = require("../models/Marks");


exports.createMarksService = async (data) => {
    const result = await Marks.create(data);
    return result;
}
exports.updateMarksFromSemesterUpdate = async (id, info) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: id }, info);
    return result;
}
