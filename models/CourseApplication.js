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
        // type: ObjectId,
        // ref: 'profile'
        type: String
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
        enum: ['pending', 'successful', 'chairman-denied', 'hall-denied', 'academic-committee-denied'],
        default: 'pending'
    },
    isChairmanVerified: {
        type: Boolean,

    },
    chairmanMessage: {
        type: String
    },
    isHallVerified: {
        type: Boolean,

    },
    hallMessage: {
        type: String
    },
    isAcademicCommitteeVerified: {
        type: Boolean,

    },
    academicCommitteeMessage: {
        type: String
    },
    isPaid: {
        type: Boolean,
    },
    paymentId: {
        type: ObjectId,
        ref: 'payment'
    },
    tran_id: {
        type: String,
        // unique: true
    },


}, {
    timestamps: true
})

const CourseApplication = mongoose.model('course-application', courseApplicationSchema)
module.exports = CourseApplication;