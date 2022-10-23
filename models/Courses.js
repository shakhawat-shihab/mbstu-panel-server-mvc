const mongoose = require('mongoose')
const validator = require('validator')
const { ObjectId } = mongoose.Schema.Types;
const courseSchema = mongoose.Schema({
    courseCode: {
        type: String,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 100,
    },
    courseTitle: [{
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 100,
    }],
    credit: {
        type: Number
    },
    category: {
        type: String,
        enum: ['compoulsary', 'optional'],
    },
    semesterCode: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    departmental: {
        type: String,
        enum: ['departmental', 'non departmental'],
    },
    relatedDepartment: [{
        type: String
    }],
    type: {
        type: String,
        enum: ['theory', 'lab', 'project'],
    }
}, {
    timestamps: true
})

courseSchema.pre("save", function (next) {
    this.relatedDepartment.push(this.department)
    next();
});


const Course = mongoose.model("course", courseSchema);

module.exports = Course;