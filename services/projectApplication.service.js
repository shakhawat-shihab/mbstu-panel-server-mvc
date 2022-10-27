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
    result?.coursesMarks.map(x => {
        if (x.type == 'project')
            arrayOfProjectCourse.push(x)
    })
    // console.log(result);
    // console.log(arrayOfProjectCourse);
    return arrayOfProjectCourse
}

exports.getMyProposalForACourseService = async (profileId, courseId) => {
    const applications = ProjectApplication.find({ applicantProfileId: profileId, courseMarksId: courseId })
    console.log(applications);
    return applications
}





