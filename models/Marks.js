const mongoose = require('mongoose')
const validator = require('validator')
const { ObjectId } = mongoose.Schema.Types;
const marksSchema = mongoose.Schema({
    courseCode: {
        type: String,
        trim: true,
        // required: [true, "Please provide a first name"],
        // minLength: 3,
        maxLength: 100,
    },
    courseTitle: {
        type: String,
        trim: true,
        // required: [true, "Please provide a last name"],
        // minLength: 3,
        maxLength: 100,
    },
    teacher: {
        type: String,
        trim: true,
        // required: [true, "Please provide a last name"],
        // minLength: 3,
        maxLength: 100,
    },
    semesterId: {
        type: ObjectId
    },
    studentsMarks: [{
        name: String,
        id: String,
        studentProfileId: {
            type: ObjectId,
            ref: "profile",
            // required: true,
        },
        marks: {
            type: Number
        }
    }],

}, {
    timestamps: true
})

// for mail verification
marksSchema.methods.setSemester = function (id) {
    this.semesterId = ObjectId(id);
};



const Marks = mongoose.model("marks", marksSchema);

module.exports = Marks;