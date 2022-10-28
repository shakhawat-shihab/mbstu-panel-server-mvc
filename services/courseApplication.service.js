const CourseApplication = require("../models/CourseApplication");

exports.createCourseApplicationService = async (data) => {
    const result = await CourseApplication.create(data);
    return result;
}

exports.getApplicationForADepartmentService = async (department) => {
    const result = await CourseApplication.find({ department: department, isChairmanVerified: false })
        .populate({ path: 'regularCourses', select: 'credit courseCode courseTitle  ' })
        .populate({ path: 'backlogCourses', select: 'credit courseCode courseTitle ' })
        .populate({ path: 'specialCourses', select: 'credit courseCode courseTitle ' })

    return result;
}

exports.getApplicationForAHallService = async (hallId) => {
    const result = await CourseApplication.find({ applicantHallId: hallId, isHallVerified: false })
        .populate({ path: 'regularCourses', select: 'credit courseCode courseTitle  ' })
        .populate({ path: 'backlogCourses', select: 'credit courseCode courseTitle ' })
        .populate({ path: 'specialCourses', select: 'credit courseCode courseTitle ' });
    return result;
}

exports.getApplicationForAcademicService = async () => {
    const result = await CourseApplication.find({ isAcademicCommitteeVerified: false })
        .populate({ path: 'regularCourses', select: 'credit courseCode courseTitle  ' })
        .populate({ path: 'backlogCourses', select: 'credit courseCode courseTitle ' })
        .populate({ path: 'specialCourses', select: 'credit courseCode courseTitle ' })
    return result;
}

exports.getTotalCreditTakenService = async (id) => {
    const result = await CourseApplication.find({ applicantProfileId: id, status: 'pending' })
        .select('name applicantId applicantName regularCourses backlogCourses specialCourses ')
        .populate({ path: 'regularCourses', select: 'credit courseCode' })
        .populate({ path: 'backlogCourses', select: 'credit courseCode' })
        .populate({ path: 'specialCourses', select: 'credit courseCode' })

    let sum = 0;
    result.map(application => {
        application?.regularCourses.map(x => {
            sum += x.credit
        })
        application?.backlogCourses.map(x => {
            sum += x.credit
        })
        application?.specialCourses.map(x => {
            sum += x.credit
        })
    })
    return sum;
}

