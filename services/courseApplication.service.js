const CourseApplication = require("../models/CourseApplication");

exports.createCourseApplicationService = async (data) => {
    const result = await CourseApplication.create(data);
    return result;
}

exports.getApplicationForADepartmentService = async (department) => {
    const result = await CourseApplication.find({ department: department, isChairmanVerified: false, status: 'pending' })
        .limit(10)
        .populate({ path: 'regularCourses', select: 'credit courseCode courseTitle  ' })
        .populate({ path: 'backlogCourses', select: 'credit courseCode courseTitle ' })
        .populate({ path: 'specialCourses', select: 'credit courseCode courseTitle ' })

    return result;
}

exports.getApplicationForAHallService = async (hallId) => {
    const result = await CourseApplication.find({ isChairmanVerified: true, isHallVerified: false, applicantHallId: hallId, status: 'pending' })
        .populate({ path: 'regularCourses', select: 'credit courseCode courseTitle  ' })
        .populate({ path: 'backlogCourses', select: 'credit courseCode courseTitle ' })
        .populate({ path: 'specialCourses', select: 'credit courseCode courseTitle ' });
    return result;
}

exports.getApplicationForAcademicService = async () => {
    const result = await CourseApplication.find({ isChairmanVerified: true, isHallVerified: true, isAcademicCommitteeVerified: false, status: 'pending' })
        .populate({ path: 'regularCourses', select: 'credit courseCode courseTitle  ' })
        .populate({ path: 'backlogCourses', select: 'credit courseCode courseTitle ' })
        .populate({ path: 'specialCourses', select: 'credit courseCode courseTitle ' })
    return result;
}

exports.getApplicationDetailsService = async (applicationId) => {
    const result = await CourseApplication.findOne({ _id: applicationId })
        .populate({ path: 'regularCourses', select: 'credit courseCode courseTitle  ' })
        .populate({ path: 'backlogCourses', select: 'credit courseCode courseTitle ' })
        .populate({ path: 'specialCourses', select: 'credit courseCode courseTitle ' })
    return result;
}

exports.getApplicationForAStudentService = async (profileId) => {
    const result = await CourseApplication.find({ applicantProfileId: profileId })
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

    let totalCreditTaken = 0;
    let foundRegularCourse = false;
    result.map(application => {
        application?.regularCourses.map(x => {
            foundRegularCourse = true;
            totalCreditTaken += x.credit
        })
        application?.backlogCourses.map(x => {
            totalCreditTaken += x.credit
        })
        application?.specialCourses.map(x => {
            totalCreditTaken += x.credit
        })
    })

    return { totalCreditTaken, foundRegularCourse };
}



exports.approveApplicationByDeptService = async (data) => {
    const result = await CourseApplication.updateOne({ _id: data.applicationId }, { $set: { isChairmanVerified: true, chairmanMessage: data.chairmanMessage } })
    return result;
}

exports.approveApplicationByAcademicSectionService = async (data) => {
    const result = await CourseApplication.updateOne({ _id: data.applicationId }, { $set: { isAcademicCommitteeVerified: true, status: 'successfull', academicCommitteeMessage: data.academicCommitteeMessage } })
    return result;
}

exports.approveApplicationByHallService = async (data) => {
    const result = await CourseApplication.updateOne({ _id: data.applicationId }, { $set: { isHallVerified: true, hallMessage: data.hallMessage } })
    return result;
}

exports.denyApplicationByDeptService = async (data) => {
    const result = await CourseApplication.updateOne({ _id: data.applicationId }, { $set: { status: 'chairman-denied', chairmanMessage: data.chairmanMessage } })
    return result;
}

exports.denyApplicationByAcademicSectionService = async (data) => {
    const result = await CourseApplication.updateOne({ _id: data.applicationId }, { $set: { status: 'academic-committee-denied', academicCommitteeMessage: data.academicCommitteeMessage } })
    return result;
}

exports.denyApplicationByHallService = async (data) => {
    const result = await CourseApplication.updateOne({ _id: data.applicationId }, { $set: { status: 'hall-denied', hallMessage: data.hallMessage } })
    return result;
}

