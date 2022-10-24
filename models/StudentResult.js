const mongoose = require('mongoose')
const validator = require('validator')
const { ObjectId } = mongoose.Schema.Types;
const studentResultSchema = mongoose.Schema({
    studentProfile: {
        type: ObjectId,
        ref: 'profile'
    },
    department: {
        type: String
    },
    id: {
        type: String
    },
    coursesMarks: [{
        type: ObjectId,
        ref: "marks"
    }],
    semesterCode: {
        type: Number,
    },
}, {
    timestamps: true
})

const StudentResult = mongoose.model("students-results", studentResultSchema);

module.exports = StudentResult;