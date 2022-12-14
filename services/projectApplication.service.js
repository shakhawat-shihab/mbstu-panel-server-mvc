const Marks = require("../models/Marks");
const ProjectApplication = require("../models/ProjectApplication");
const { getCoursesOfRunningSemesterBySemesterCodeService, getCoursesPreviousRunningSemesterService } = require("./semester.service");
const { getStudentSemesterCodeService, getStudentResultService } = require("./studentsResult.service");

exports.createProjectApplicationService = async (data) => {
    const result = await ProjectApplication.create(data);
    return result;
}

exports.getProjectCoursesService = async (studentProfileId, department) => {
    // console.log(studentProfileId, department);
    //get semester code
    const data = await getStudentResultService(studentProfileId);
    // console.log(' getStudentResultService =>  ', data);
    // get courses of running semester
    const date = new Date();
    const result = await getCoursesPreviousRunningSemesterService(data?.semesterCode + 1, department, studentProfileId, date)
    // console.log('getCoursesPreviousRunningSemesterService => ', result);
    const arrayOfProjectCourse = [];
    result?.map(x => {
        if (x.type == 'project') {
            arrayOfProjectCourse.push(x);
        }
    })

    // arrayOfBacklogProjectCourse refers to the course info that is backlogged
    const arrayOfBacklogProjectCourse = [];
    data?.coursesMarks?.map(x => {
        if (x.type == 'project' && (x.projectClass + x.projectExam) < 40) {
            arrayOfBacklogProjectCourse.push(x);
        }
    })
    // console.log(arrayOfBacklogProjectCourse)


    // result?.coursesMarks?.map(x => {
    //     let found = false;
    //     if (x.type == 'project') {
    //         data?.coursesMarks.map(c => {
    //             if (c.courseCode == x.courseCode) {
    //                 console.log('found');
    //             }
    //             if (c.courseCode == x.courseCode && (c.projectClass + c.projectClass) < 40) {
    //                 found = true;
    //                 arrayOfProjectCourse.push(x)
    //             }
    //         })
    //         if (found == false) {
    //             arrayOfProjectCourse.push(x)
    //         }
    //     }
    // })
    // console.log(result);
    // console.log(arrayOfProjectCourse);
    return { arrayOfProjectCourse, arrayOfBacklogProjectCourse };
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
    const result = await ProjectApplication.updateOne({ _id: proposalId }, { $set: { status: "accepted" } });
    // console.log(applications);
    return result;
}

exports.updateProposalToDenyService = async (proposalId) => {
    const result = await ProjectApplication.updateOne({ _id: proposalId }, { $set: { status: "denied" } });
    // console.log(applications);
    return result;
}

exports.updateProposalToDiscontinuedService = async (courseMarksId, studentProfileId) => {
    const result = await ProjectApplication.updateMany({ courseMarksId: courseMarksId, applicantProfileId: studentProfileId, status: "pending" }, { $set: { status: "discontinued" } });
    // console.log(applications);
    return result;
}

exports.getAcceptedProposalService = async (studentProfileId, courseMarksId) => {
    // const application = await ProjectApplication.findOne({ courseMarksId: courseMarksId,  });
    const application = await ProjectApplication.findOne({ courseMarksId: courseMarksId, applicantProfileId: studentProfileId, status: 'accepted' });
    // console.log(application);
    return application;
}





