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
        credit: {
            type: Number
        },
        courseId: {
            type: ObjectId
        },
        semesterCode: {
            type: Number
        },
        theorySeventy: {
            type: Number
        },
        theoryThirty: {
            type: Number
        },
        labSixty: {
            type: Number
        },
        labFourty: {
            type: Number
        },
        projectSeventy: {
            type: Number
        },
        projectThirty: {
            type: Number
        },

    }],
    semesterCode: {
        type: Number,
    },
    semesterIds: [{
        type: ObjectId,
        ref: 'semester'
    }
    ]
}, {
    timestamps: true
})

const StudentResult = mongoose.model("students-results", studentResultSchema);

module.exports = StudentResult;