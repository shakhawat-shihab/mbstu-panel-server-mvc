const Marks = require("../models/Marks");
const Semester = require("../models/Semester");
const { getStudentResultService } = require("./studentsResult.service");

exports.createSemesterService = async (data) => {
    const result = await Semester.create(data);
    return result;
}

exports.findSemesterService = async (filters) => {
    const { semesterCode, session } = filters;
    const result = await Semester.findOne({ semesterCode, session });
    return result;
}

exports.updateSemesterService = async (id, semester) => {
    const result = await Semester.updateOne({ _id: id }, { $set: semester });
    return result;
}

exports.updateExamTakenService = async (id) => {
    const date = new Date();
    const result = await Semester.updateOne({ _id: id }, { $set: { isExamTaken: true, examFinishDate: date } });
    return result;
}


exports.getCoursesOfRunningSemesterBySemesterCodeService = async (semesterCode, dept, date) => {
    // isRunning: true    ==> isExamTaken:false
    const courses = await Semester.findOne({ semesterCode: semesterCode, department: dept, registrationCloseDate: { $gte: date }, isExamTaken: false })
        .select('coursesMarks name degree')
        .populate({ path: 'coursesMarks', select: 'courseCode courseTitle credit type teacher semesterId' })
    // console.log(courses)
    return courses;
}

exports.getCoursesBySemesterIdService = async (semesterId) => {
    const courses = await Semester.findOne({ _id: semesterId })
        .select('coursesMarks name degree department session')
        .populate({ path: 'coursesMarks', select: ' _id courseCode courseTitle credit type teacher semesterId' })
    // console.log(courses.coursesMarks)
    return courses;
}

exports.getRunningSemesterByExamCommitteeService = async (profileId) => {
    // console.log('profileId ', profileId);
    // const result = await Semester.find({ examCommittee: { $eq: profileId } })
    const result = await Semester.find({ $or: [{ examCommittee: { $eq: profileId } }, { examCommitteeChairman: { $eq: profileId } }], isResultPublished: false })
        .select('  name semesterCode department session degree examCommittee examCommitteeChairman ')
    return result;
}

exports.getRunningSemesterByExamCommitteeChairmanService = async (profileId) => {
    // console.log('profileId ', profileId);
    const result = await Semester.find({ examCommitteeChairman: { $eq: profileId }, isResultPublished: false })
        .select('  name semesterCode department session degree examCommittee examCommitteeChairman ')
    return result;
}

exports.publishResultStateChangeSemesterService = async (semesterId) => {
    // console.log('semesterId ', semesterId);
    const date = new Date();
    const result = await Semester.updateOne({ _id: semesterId }, { $set: { isRunning: false, isExamTaken: true, isResultPublished: true, resultPublishDate: date } })
    return result;
}


exports.getCoursesPreviousRunningSemesterService = async (semesterCode, dept, profileId, date) => {
    semesterCode = parseInt(semesterCode);
    // console.log('semesterCode = ', semesterCode, ' and dept = ', dept);
    const result = await Semester.aggregate([
        { $match: { "semesterCode": { $lte: semesterCode }, "registrationCloseDate": { $gte: date }, "department": dept, "isRunning": true } },
        { $lookup: { from: 'marks', localField: 'coursesMarks', foreignField: '_id', as: 'course' } },
        {
            $project: {
                'course': 1,
                '_id': 0
            }
        },
        { $unwind: "$course" },
        {
            $project: {
                'course.courseCode': 1,
                'course.courseTitle': 1,
                'course.credit': 1,
                'course.teacher': 1,
                'course.semesterId': 1,
                'course._id': 1,
                'course.type': 1,
            }
        },
    ])
    const studentResult = await getStudentResultService(profileId);
    const arr = []
    //console.log('studentResult  === > ', studentResult)
    // console.log('result   === > ', result)
    result?.map(x => {
        let found = false;
        // console.log(x)
        studentResult?.coursesMarks?.map(c => {
            // console.log(c.courseCode)
            if (c.courseCode == x.course.courseCode) {
                found = true;
                if (c.type == 'theory' && (c.theorySeventy + c.theoryThirty) < 40) {
                    arr.push(x.course)
                }
                else if (c.type == 'lab' && (c.labClass + c.labExam) < 40) {
                    console.log(c.labClass + c.labExam)
                    arr.push(x.course)
                }
                else if (c.type == 'project' && (c.projectClass + c.projectExam) < 40) {
                    arr.push(x.course)
                }
                return;
            }
        })
        !found && arr.push(x.course)
    })

    return arr;
}



//need a lot of modification here
exports.getMarksOfCurrentSemesterService = async (semesterId) => {
    // const result = await Semester.findOne({ _id: semesterId })
    //     .select('coursesMarks examCommittee examCommitteeChairman name degree department session ')
    //     .populate({ path: 'coursesMarks' })
    //     .populate('examCommitteeChairman')

    const semester = await Semester.findOne({ _id: semesterId })
        .populate('coursesMarks');

    // console.log(semester)
    let totalCreditOffered = 0;
    const arrayOfCoursesId = []
    semester?.coursesMarks.map(x => {
        totalCreditOffered += x?.credit;
        arrayOfCoursesId.push(x?._id)
    })

    const marks = await Marks.aggregate([
        {
            $match: {
                "_id": {
                    $in: arrayOfCoursesId
                }
            }
        },
        {
            $unwind: "$studentsMarks"
        },
        {
            $group: {
                // _id: "$studentsMarks.id",
                _id: {
                    id: "$studentsMarks.id",
                    profile: "$studentsMarks.studentProfileId"
                },
                marksArray: {
                    $push: {
                        courseCode: "$courseCode",
                        courseTitle: "$courseTitle",
                        courseId: "$_id",
                        type: "$type",
                        credit: "$credit",
                        theoryAttendance: "$studentsMarks.theoryAttendance",
                        theoryCT1: "$studentsMarks.theoryCT1",
                        theoryCT2: "$studentsMarks.theoryCT2",
                        theoryCT3: "$studentsMarks.theoryCT3",
                        theoryFinal: "$studentsMarks.theoryFinal",
                        theorySecondExaminer: "$studentsMarks.theorySecondExaminer",
                        theoryThirdExaminer: "$studentsMarks.theoryThirdExaminer",
                        labAttendance: "$studentsMarks.labAttendance",
                        labReport: "$studentsMarks.labReport",
                        labQuiz: "$studentsMarks.labQuiz",
                        labExperiment: "$studentsMarks.labExperiment",
                        labExperimentBy: "$studentsMarks.labExperimentBy",
                        projectClassPerformance: "$studentsMarks.projectClassPerformance",
                        projectInternalMarks: "$studentsMarks.projectInternalMarks",
                        projectClassPerformanceBy: "$studentsMarks.projectClassPerformanceBy",
                        projectClassPerformanceByProfileId: "$studentsMarks.projectClassPerformanceByProfileId",
                        projectPresentation: "$studentsMarks.projectPresentation",
                        projectPresentationBy: "$studentsMarks.projectPresentationBy",
                        isPaid: "$studentsMarks.isPaid",
                        isBacklog: "$studentsMarks.isBacklog",
                    }
                }
            }
        },
        { $lookup: { from: 'profiles', localField: '_id.profile', foreignField: '_id', as: 'studentInfo' } }
    ])

    return { marks, totalCreditOffered, semester };
}

