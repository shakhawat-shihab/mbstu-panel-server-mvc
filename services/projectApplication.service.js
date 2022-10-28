const Marks = require("../models/Marks");
const ProjectApplication = require("../models/ProjectApplication");
const { getCoursesOfRunningSemesterBySemesterCodeService } = require("./semester.service");
const { getStudentSemesterCodeService } = require("./studentsResult.service");

exports.createProjectApplicationService = async (data) => {
    const result = await ProjectApplication.create(data);
    return result;
}

exports.getProjectCoursesService = async (studentProfileId, department) => {
    // console.log(studentProfileId, department);

    //get semester code
    const data = await getStudentSemesterCodeService(studentProfileId);
    // get courses of running semester
    const result = await getCoursesOfRunningSemesterBySemesterCodeService(data?.semesterCode + 1, department);

    const arrayOfProjectCourse = [];
    result?.coursesMarks?.map(x => {
        if (x.type == 'project')
            arrayOfProjectCourse.push(x)
    })
    // console.log(result);
    // console.log(arrayOfProjectCourse);
    return arrayOfProjectCourse
}

exports.getMyProposalForACourseService = async (profileId, courseId) => {
    const applications = await ProjectApplication.find({ applicantProfileId: profileId, courseMarksId: courseId })
    // console.log(applications);
    return applications
}
exports.getProposalToTeacherForACourseService = async (profileId, courseId) => {
    const applications = await ProjectApplication.find({ 'teacher.teacherProfileId': profileId, courseMarksId: courseId, status: 'pending' })
    // console.log(applications);
    return applications
}

exports.getProposalDetailsService = async (proposalId) => {
    const proposal = await ProjectApplication.findOne({ _id: proposalId })
    // console.log(applications);
    return proposal;
}

exports.approveProposalService = async (proposalId) => {
    const proposal = await ProjectApplication.findOne({ _id: proposalId },)
    // console.log(applications);
    return proposal;
}

exports.updateProposalToApproveService = async (proposalId) => {
    const result = await ProjectApplication.updateOne({ _id: proposalId }, { $set: { status: "successful" } });
    // console.log(applications);
    return result;
}

exports.updateProposalToDiscontinuedService = async (courseMarksId, studentProfileId) => {
    const result = await ProjectApplication.updateOne({ courseMarksId: courseMarksId, applicantProfileId: studentProfileId, status: "pending" }, { $set: { status: "discontinued" } });
    // console.log(applications);
    return result;
}





