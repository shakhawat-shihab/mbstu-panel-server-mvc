const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const validator = require('validator')

const projectApplicationSchema = mongoose.Schema({
    projectApplicationTitle: {
        type: String,
        required: true,
    },
    projectApplicationDescription: {
        type: String,
        required: true,
    },
    courseTitle: {
        type: String,
    },
    courseCode: {
        type: String,
    },
    courseMarksId: {
        type: ObjectId,
        ref: 'marks'
    },
    department: {
        type: String,
        required: true
    },
    departmentName: {
        type: String,
        required: true
    },
    teacherName: {
        type: String,
    },
    teacherProfileId: {
        type: ObjectId,
        ref: 'profile'
    },
    applicantId: {
        type: String,
    },
    applicantProfileId: {
        type: ObjectId,
        ref: 'profile'
    },
    applicantName: {
        type: String,
    },
    applicantEmail: {
        type: String,
    },
    applicantSession: {
        type: String,
    },
    teacher: {
        name: String,
        teacherProfileId: {
            type: ObjectId,
            ref: 'profile'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'denied', 'discontinued'],
        default: 'pending'
    },

}, {
    timestamps: true
})

const ProjectApplication = mongoose.model('projet-application', projectApplicationSchema)
module.exports = ProjectApplication;