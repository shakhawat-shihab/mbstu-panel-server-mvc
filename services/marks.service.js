const Marks = require("../models/Marks");

exports.updateMarksFromSemesterUpdate = async (id, info) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: id }, info);
    return result;
}
