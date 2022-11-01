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
        courseCode: {
            type: String
        },
        courseTitle: {
            type: String
        },
        type: {
            type: String
        },
        courseId: {
            type: ObjectId
        },
        theoryFinal: {
            type: Number
        }
    }],
    semesterCode: {
        type: Number,
    },
}, {
    timestamps: true
})

const StudentResult = mongoose.model("students-results", studentResultSchema);

module.exports = StudentResult;