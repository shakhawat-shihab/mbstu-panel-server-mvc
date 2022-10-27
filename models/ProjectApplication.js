const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const validator = require('validator')

const projectApplicationSchema = mongoose.Schema({
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

    status: {
        type: String,
        enum: ['pending', 'successful', 'denied'],
        default: 'pending'
    },


}, {
    timestamps: true
})

const ProjectApplication = mongoose.model('projet-application', projectApplicationSchema)
module.exports = ProjectApplication;