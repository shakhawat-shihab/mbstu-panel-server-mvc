const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const validator = require('validator')

const courseApplicationSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    semesterCode: {
        type: Number,
    },
    department: {
        type: String,
    },
    departmentName: {
        type: String,
    },
    degree: {
        type: String,
    },
    applicantId: {
        type: String,
    },
    applicantProfileId: {
        type: String,
    },
    applicantName: {
        type: String,
    },
    applicantSession: {
        type: String,

    },
    applicantHallName: {
        type: String,

    },
    applicantHallId: {
        type: String,

    },
    regularCourses: [{
        type: ObjectId,
        ref: 'marks'
    }],
    backlogCourses: [{
        type: ObjectId,
        ref: "marks"
    }],
    specialCourses: [{
        type: ObjectId,
        ref: "marks"
    }],
    status: {
        type: String,
        enum: ['pending', 'successful'],
        default: 'pending'
    },
    isChairmanVerified: {
        type: Boolean,
        default: false
    },
    isHallVerified: {
        type: Boolean,
        default: false
    },
    isAcademicCommitteeVerified: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
})

const CourseApplication = mongoose.model('course-application', courseApplicationSchema)
module.exports = CourseApplication;