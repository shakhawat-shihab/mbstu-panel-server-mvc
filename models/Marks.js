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
        lowercase: true,
    },
    courseTitle: {
        type: String,
        trim: true,
        // required: [true, "Please provide a last name"],
        // minLength: 3,
        maxLength: 100,
    },
    credit: {
        type: Number,
    },
    type: {
        type: String,
        enum: ['theory', 'lab', 'project']
    },
    teacher: {
        name: {
            type: String,
            trim: true,
        },
        teacherProfileId: {
            type: ObjectId,
            ref: "profile",
        }
    },
    secondExaminer: {
        name: {
            type: String,
            trim: true,
        },
        teacherProfileId: {
            type: ObjectId,
            ref: "profile",
        }
    },
    thirdExaminer: {
        name: {
            type: String,
            trim: true,
        },
        teacherProfileId: {
            type: ObjectId,
            ref: "profile",
        }
    },

    // for project courses 
    teacherList: [{
        type: ObjectId,
        ref: "profile",
    }],

    // for project courses 
    teacherStudentMap: [{
        teacherProfileId: {
            type: ObjectId,
            ref: "profile",
        },
        students: [{
            type: String,
            ref: 'profile'
        }]
    }],


    semesterId: {
        type: ObjectId,
        ref: "semester",
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
        },
        theoryAttendance: {
            type: Number,
            max: 10
        },
        theoryCT1: {
            type: Number,
        },
        theoryCT2: {
            type: Number,
        },
        theoryCT3: {
            type: Number,
        },
        theoryFinal: {
            type: Number,
            max: 70
        },
        theorySecondExaminer: {
            type: Number,
            max: 70
        },
        theoryThirdExaminer: {
            type: Number,
            max: 70
        },
        labAttendance: {
            type: Number,
            max: 15
        },
        labReport: {
            type: Number,
            max: 15
        },
        labQuiz: {
            type: Number,
            max: 30
        },
        labExperiment: {
            type: Number,
            max: 40
        },
        labExperimentBy: {
            type: String,
        },
        projectClassPerformance: {
            type: Number,
            max: 70
        },
        projectClassPerformanceBy: {
            type: String,
        },
        projectPresentation: {
            type: Number,
            max: 30
        },
        projectPresentationBy: {
            type: String,
        },
        isPaid: {
            type: Boolean,
            default: false
        }
    }],
    isSubmittedByCourseTeacher: {
        type: Boolean,
    },
    isSubmittedBySecondExaminer: {
        type: Boolean,
    },
    isSubmittedByThirdExamier: {
        type: Boolean,
    }

}, {
    timestamps: true
})

// for mail verification
// marksSchema.methods.setSemester = function (id) {
//     this.semesterId = ObjectId(id);
// };

//to add student when chairman approve an application
marksSchema.methods.setStudent = function (data) {
    this.studentsMarks.push(data);
};

// to add payment information when a course is paid
marksSchema.methods.setPayment = function (index) {
    this.studentsMarks[index].isPaid = true;
    // this.isPaid = true;
};


marksSchema.methods.setTeacherStudentMap = function (data) {
    //this.studentsMarks.isPaid = true;
    // this.isPaid = true;
    console.log(' setTeacherStudentMap function in Msrks model === ', data);
    this.teacherStudentMap = data;
};

const Marks = mongoose.model("marks", marksSchema);

module.exports = Marks;