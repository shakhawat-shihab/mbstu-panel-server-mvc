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
    degree: {
        type: String,
        required: true
    },
    coursesMarks: [{
        type: ObjectId,
        ref: "marks"
    }],
    examCommittee: [{
        // ProfileId: {
        type: ObjectId,
        ref: 'profile'
        // }
    }],
    examCommitteeChairman: {
        type: ObjectId,
        ref: 'profile'
    },
    // studentsCourses: [{
    //     id: String,
    //     studentProfileId: {
    //         type: ObjectId,
    //         ref: 'profile'
    //     },
    //     coursesMarksList: [{
    //         type: ObjectId,
    //         ref: 'marks'
    //     }]
    // }],
    isRunning: {
        type: Boolean,
        default: true
    }


}, {
    timestamps: true
})



semesterSchema.methods.setCoursesAndStudentsCourses = function (data) {
    // this.studentsCourses = data.studentsCourses;
    this.coursesMarks = data.coursesMarks
};



const Semester = mongoose.model("semester", semesterSchema);

module.exports = Semester;