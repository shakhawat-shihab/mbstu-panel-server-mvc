const Marks = require("../models/Marks");
const { getMarksService } = require("../services/marks.service");
const { createProjectApplicationService, getProjectCoursesService, getMyProposalForACourseService } = require("../services/projectApplication.service");

exports.createProjectApplication = async (req, res, next) => {
    try {
        const application = await createProjectApplicationService(req.body)
        res.status(200).json({
            status: "success",
            message: "applied supervisor successfully!",
            data: application,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to apply to supervisor",
            error: error.message,
        });
    }
}

exports.getProjectCourses = async (req, res, next) => {
    try {
        const { profileId, department } = req.user;
        const courses = await getProjectCoursesService(profileId, department)
        res.status(200).json({
            status: "success",
            message: "project courses loaded successfully!",
            data: courses,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load project courses",
            error: error.message,
        });
    }
}

exports.getMyProposalForACourse = async (req, res, next) => {
    try {
        const { profileId } = req.user;
        const { courseId } = req.params;
        const application = await getMyProposalForACourseService(profileId, courseId)
        res.status(200).json({
            status: "success",
            message: "Applications loaded successfully!",
            data: application,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load applications.",
            error: error.message,
        });
    }
}

exports.updateProposalToApprove = async (req, res, next) => {
    try {
        const { profileId } = req.user;
        const { courseId, studentProfileId } = req.params;



        //get the course from course marks table
        const marks = await getMarksService(courseId);

        if (!marks.teacherList.includes(profileId)) {
            return res.status(400).json({
                status: "fail",
                message: "You are not a teacher of these course",
            });
        }

        const array = []
        let found = false;
        // if teacher is found inside teacherStudentMap, then push student id in the array
        marks?.teacherStudentMap.map(x => {
            if (x?.teacherProfileId == profileId) {
                found = true;
                x.students.push(studentProfileId)
                array.push(x)
            }
            else {
                array.push(x)
            }
        })

        // if teacher is not found inside teacherStudentMap, so create a object (this object will be an elelemnt of teacherStudentMap array )
        if (found == false) {
            const obj = {}
            obj.teacherProfileId = profileId;
            obj.students = [studentProfileId]
            array.push(obj)
        }

        //now array consists of all teacherStudentMap information
        marks.setTeacherStudentMap(array);
        await marks.save({ validateBeforeSave: false });




        console.log(found);
        console.log('array  ', array);


        // const application = await getMyProposalForACourseService(profileId, courseId)


        res.status(200).json({
            status: "success",
            message: "Applications loaded successfully!",

        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load applications.",
            error: error.message,
        });
    }
}


