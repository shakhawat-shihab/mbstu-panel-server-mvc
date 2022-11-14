const { createCourseApplicationService, getTotalCreditTakenService, getApplicationForADepartmentService, getApplicationForAcademicService, getApplicationForAHallService, approveApplicationByDeptService, getApplicationDetailsService, approveApplicationByAcademicSectionService, approveApplicationByHallService, denyApplicationByAcademicSectionService, denyApplicationByDeptService, denyApplicationByHallService, getApplicationForAStudentService } = require("../services/courseApplication.service");
const { getCoursesMarksService } = require("../services/marks.service");



exports.createCourseApplication = async (req, res, next) => {
    try {
        const application = await createCourseApplicationService(req.body)
        res.status(200).json({
            status: "success",
            message: "application created successfully!",
            data: application,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to create application",
            error: error.message,
        });
    }
}

exports.getTotalCreditTaken = async (req, res, next) => {
    try {
        const { profileId } = req?.user;
        const { semesterCode } = req?.params;
        console.log('getTotalCreditTaken ==> ', profileId, semesterCode)
        const totalCredit = await getTotalCreditTakenService(profileId, semesterCode);
        res.status(200).json({
            status: "success",
            message: "loaded successfully!",
            data: totalCredit,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to loadn",
            error: error.message,
        });
    }
}

exports.getApplicationDetails = async (req, res, next) => {
    try {
        const user = req.user;
        const { applicationId } = req.params;
        const application = await getApplicationDetailsService(applicationId);
        // console.log(user?.profileId, application?.applicantProfileId)
        if (user?.profileId != application?.applicantProfileId && !user?.isHallProvost && !user?.isAcademicCommittee && !user?.isDeptChairman) {
            return res.status(400).json({
                status: "fail",
                message: "You are not authorized to view it",
            });
        }
        res.status(200).json({
            status: "success",
            message: "Application details loaded successfully!",
            data: application,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}


exports.getApplicationForAStudent = async (req, res, next) => {
    try {
        const user = req.user;
        const applications = await getApplicationForAStudentService(user?.profileId);

        res.status(200).json({
            status: "success",
            message: "Applications loaded successfully!",
            data: applications,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}

exports.getApplicationForADepartment = async (req, res, next) => {
    try {
        const user = req.user;
        const applications = await getApplicationForADepartmentService(user?.department);
        res.status(200).json({
            status: "success",
            message: "Applications loaded successfully!",
            data: applications,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}

exports.getApplicationForAHall = async (req, res, next) => {
    try {
        const user = req.user;
        //check if the user is hall provost

        const applications = await getApplicationForAHallService(user?.hall?.hallId);
        res.status(200).json({
            status: "success",
            message: "Applications loaded successfully!",
            data: applications,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}

exports.getApplicationForAcademic = async (req, res, next) => {
    try {
        const user = req.user;
        const applications = await getApplicationForAcademicService();
        res.status(200).json({
            status: "success",
            message: "Applications loaded successfully!",
            data: applications,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}

exports.approveApplicationByDept = async (req, res, next) => {
    try {
        const user = req.user;
        const data = req.body;

        //regularCourses and backlogCourses
        // console.log('data ', data)
        const { regularCourses, backlogCourses } = data;

        //1 
        //add the student to the specific "marks" collection of courses  For REGULAR
        const resultRegular = await getCoursesMarksService(regularCourses)
        // console.log('resultRegular ', resultRegular);
        let resultsRegular = resultRegular.map(async (course) => {
            let found = false;
            course.studentsMarks.map(async (student) => {
                if (student.studentProfileId == data.studentProfileId) {
                    found = true;
                    return;
                }
            })
            if (found == false) {

                // push the student to that course
                console.log('not found me on regular ', course.courseCode);
                course.setStudent({ id: data.id, studentProfileId: data.studentProfileId })
                await course.save({ validateBeforeSave: false })
            }
        })
        await Promise.all(resultsRegular)

        //add the student to the specific "marks" collection of courses For BACKLOG
        const resultBacklog = await getCoursesMarksService(backlogCourses)
        // console.log('resultBacklog ', resultBacklog);
        let resultsBacklog = resultBacklog.map(async (course) => {
            let found = false;
            course.studentsMarks.map(async (student) => {
                if (student.studentProfileId == data.studentProfileId) {
                    found = true;
                    return;
                }
            })
            if (found == false) {
                // push the student to that course
                console.log('not found me on backlog ', course.courseCode);
                course.setStudent({ id: data.id, isBacklog: true, studentProfileId: data.studentProfileId })
                await course.save({ validateBeforeSave: false })
            }
        })
        await Promise.all(resultsBacklog)


        //2
        // set application,,,,, { isChairmanVerified: true, chairmanMessage: data.chairmanMessage}
        const output = await approveApplicationByDeptService(data);

        res.status(200).json({
            status: "success",
            message: "Applications approved successfully By Department cahirman!",
            data: output,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to approve",
            error: error.message,
        });
    }
}


exports.approveApplicationByAcademicSection = async (req, res, next) => {
    try {
        const user = req.user;
        const data = req.body;

        //check if the user is hall provost

        //1 
        //update the student payment info to "marks" collection of courses
        const result = await getCoursesMarksService(data.courses)
        // console.log('result ', result);
        let results = result.map(async (course) => {
            let index = 0;
            course.studentsMarks.map(async (student) => {
                if (student.studentProfileId == data.studentProfileId) {
                    course.setPayment(index)
                    const r = await course.save({ validateBeforeSave: false })
                    // console.log('r ', r)
                }
                index += 1;
            })
        })
        await Promise.all(results)

        //2
        // set application,,,,, { isAcademicCommitteeVerified: true, status:'successfull', academicCommitteeMessage: data.chairmanMessage}
        const output = await approveApplicationByAcademicSectionService(data);

        res.status(200).json({
            status: "success",
            message: "Applications approved successfully by Academic Section",
            data: output,
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to approve",
            error: error.message,
        });
    }
}

exports.approveApplicationByHall = async (req, res, next) => {
    try {
        const user = req.user;
        const data = req.body;
        //check if the user is hall provost of that hall

        //1
        // set application,,,,, { isHallVerified: true, hallMessage: data.hallMessage}
        const output = await approveApplicationByHallService(data);

        res.status(200).json({
            status: "success",
            message: "Applications approved successfully by Hall",
            data: output,
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to approve",
            error: error.message,
        });
    }
}


exports.denyApplicationByDept = async (req, res, next) => {
    try {
        const user = req.user;
        const data = req.body;
        //check if the user is the dept chairman of that department

        //1
        // set application,,,,, { status: 'chairman-denied', chairmanMessage: data.chairmanMessage}
        const output = await denyApplicationByDeptService(data);

        res.status(200).json({
            status: "success",
            message: "Application denied  successfully by Department chairman",
            data: output,
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to deny",
            error: error.message,
        });
    }
}

exports.denyApplicationByAcademicSection = async (req, res, next) => {
    try {
        const user = req.user;
        const data = req.body;
        //check if the user is the user is in academic committee

        //1
        // set application,,,,, { status: 'academic-committee-denied', academicCommitteeMessage: data.academicCommitteeMessage}
        const output = await denyApplicationByAcademicSectionService(data);

        res.status(200).json({
            status: "success",
            message: "Application denied  successfully by Academic committee",
            data: output,
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to deny",
            error: error.message,
        });
    }
}

exports.denyApplicationByHall = async (req, res, next) => {
    try {
        const user = req.user;
        const data = req.body;
        //check if the user is the hall provost

        //1
        // set application,,,,, { status: 'hall-denied', hallMessage: data.hallMessage}
        const output = await denyApplicationByHallService(data);

        res.status(200).json({
            status: "success",
            message: "Application denied successfully by Hall",
            data: output,
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to deny",
            error: error.message,
        });
    }
}


