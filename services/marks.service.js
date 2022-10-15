const Marks = require("../models/Marks");


exports.createMarksService = async (data) => {
    const result = await Marks.create(data);
    return result;
}

exports.getCourseMarksService = async (data) => {
    console.log(data);
    const result = await Marks.find({ _id: { $in: data.courses } });
    return result;
}

exports.updateMarksFromSemesterUpdate = async (id, info) => {
    // console.log(id, info)
    const result = await Marks.updateOne({ _id: id }, info);
    return result;
}
exports.addStudentService = async (data) => {
    console.log(data)

    // var bulk = Marks.collection.initializeOrderedBulkOp();
    // bulk.find({ '_id': { $in: [] } }).update({ $push: { studentMarks: { studentProfileId: data.studentProfileId, id: data.id } } });
    // bulk.execute(function (error) {
    //     // callback();
    //     console.log('error ', error)
    // });

    const result = Marks.updateMany({ _id: { $in: data.courses.map(({ id }) => id) } },
        [
            { "id": "A", "name": "AA", "arrayField": [1, 2, 3] },
            { "id": "B", "name": "BB", "arrayField": [4, 5, 6] },
            { "id": "C", "name": "CC", "arrayField": [7, 8] }
        ], { upsert: true });
    console.log(result)
    // const result = await Marks.updateOne({ _id: id }, info);
    // return result;
}

