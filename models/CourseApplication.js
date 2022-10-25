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
        required: true
    },
    department: {
        type: String,
        required: true
    },
    departmentName: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    applicantId: {
        type: String,
        required: true
    },
    applicantProfileId: {
        type: String,
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    applicantSession: {
        type: String,
        required: true
    },
    applicantHallName: {
        type: String,
        required: true
    },
    applicantHallId: {
        type: String,
        required: true
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




}, {
    timestamps: true
})

const courseApplication = mongoose.model('course-application', courseApplicationSchema)
module.exports = courseApplication;