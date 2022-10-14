const mongoose = require('mongoose')
const validator = require('validator')
const { ObjectId } = mongoose.Schema.Types;
const semesterSchema = mongoose.Schema({
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
    session: {
        type: String,
        required: true
    },
    courses: [{
        type: ObjectId,
        ref: "marks"
    }],
    studentsCourses: [{
        studentId: {
            type: ObjectId,
            ref: 'profile'
        },
        coursesMarksList: [{
            type: ObjectId,
            ref: 'marks'
        }]

    }],


}, {
    timestamps: true
})





const Semester = mongoose.model("semester", semesterSchema);

module.exports = Semester;