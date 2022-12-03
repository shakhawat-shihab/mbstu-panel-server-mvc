const e = require("express");
const { getCoursesMarksService, getMarksCourseTeacherService, updateMarksCourseTeacherService, getMarksService, getAllMarksOfStudentsOfACourseService, getTypeOfACourseService, updateMarksService, getTakenCoursesService, getMarksSecondExaminerService, getMarksThirdExaminerService, getTeachersForACourseService, turnInMarksCourseTeacherService, turnInMarksSecondExaminerService, turnInMarksThirdExaminerService, turnInMarksProjectTeacherService } = require("../services/marks.service");


exports.getMarksCourseTeacher = async (req, res, next) => {
    try {
        const user = req.user;
        // console.log(req.params.courseMarksId)
        const type = await getTypeOfACourseService(req.params.courseMarksId);
        const marksOfACourse = await getMarksCourseTeacherService(req.params.courseMarksId, type.type);
        // console.log(marksOfACourse.teacher[`teacherProfileId`])
        // console.log(user.profileId)
        // console.log(marksOfACourse?.teacherList);
        // console.log(marksOfACourse?.teacherList.includes(user.profileId))
        if ((user.profileId != marksOfACourse?.teacher?.[`teacherProfileId`]) && !marksOfACourse?.teacherList.includes(user.profileId)) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied",
            });
        }


        if (type.type == 'project') {
            let student = []
            //get the student under current teacher from teacherStudentMap
            marksOfACourse.teacherStudentMap.map(x => {
                if (x.teacherProfileId == user.profileId) {
                    student = x.students;
                }
            })
            // console.log('student == ', student);
            const arr = []
            marksOfACourse.studentsMarks.map(x => {
                // console.log(x);
                if (student.includes(x?.studentProfileId?._id)) {
                    arr.push(x);
                }
            })

            // console.log('arr == ', arr);
            marksOfACourse.studentsMarks = arr

            res.status(200).json({
                status: "success",
                message: "Successfully loaded",
                data: marksOfACourse
            });
        }

        else {
            res.status(200).json({
                status: "success",
                message: "Successfully loaded",
                data: marksOfACourse
            });
        }

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}



exports.getMarksSecondExaminer = async (req, res, next) => {
    try {
        const user = req.user;
        const marksOfACourse = await getMarksSecondExaminerService(req.params.courseMarksId);
        // console.log(marksOfACourse)
        if (user?.profileId != marksOfACourse?.secondExaminer[`teacherProfileId`]) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied",
            });
        }
        res.status(200).json({
            status: "success",
            message: "Successfully loaded",
            data: marksOfACourse
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}

exports.getMarksThirdExaminer = async (req, res, next) => {
    try {
        const user = req.user;
        const marksOfACourse = await getMarksThirdExaminerService(req.params.courseMarksId);
        // console.log(marksOfACourse?.thirdExaminer?.[`teacherProfileId`])
        // console.log(user?.profileId)
        if (user?.profileId != marksOfACourse?.thirdExaminer?.[`teacherProfileId`]) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied",
            });
        }
        res.status(200).json({
            status: "success",
            message: "Successfully loaded",
            data: marksOfACourse
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}


exports.updateMarksCourseTeacher = async (req, res, next) => {
    try {
        const user = req.user;
        const { courseMarksId } = req.params;
        const { propertyName } = req.body;
        const type = await getTypeOfACourseService(req.params.courseMarksId);
        const marksOfACourse = await getMarksCourseTeacherService(courseMarksId, type?.type);
        if (marksOfACourse?.isSubmittedByCourseTeacher) {
            return res.status(403).json({
                status: "fail",
                message: "You have already submitted all the marks!",
            });
        }
        if ((user.profileId != marksOfACourse?.teacher?.[`teacherProfileId`]) && !marksOfACourse?.teacherList?.includes(user.profileId)) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied",
            });
        }

        const validProperty = ['theoryAttendance', 'theoryCT1', 'theoryCT2', 'theoryCT3', 'theoryFinal', 'labAttendance', 'labReport', 'labQuiz', 'projectClassPerformance', 'projectInternalMarks', 'projectClassPerformanceBy', 'projectClassPerformanceByProfileId'];
        if (!validProperty.includes(propertyName)) {
            return res.status(400).json({
                status: "fail",
                message: "You are not authorized to add the following property",
            });
        }

        if (type?.type == 'theory' && (propertyName != 'theoryAttendance' && propertyName != 'theoryCT1' && propertyName != 'theoryCT2' && propertyName != 'theoryCT3' && propertyName != 'theoryFinal')) {
            return res.status(400).json({
                status: "fail",
                message: "You are trying to add invalid property to theory course",
            });
        }
        if (type?.type == 'lab' && (propertyName != 'labAttendance' && propertyName != 'labReport' && propertyName != 'labQuiz')) {
            return res.status(400).json({
                status: "fail",
                message: "You are trying to add invalid property to theory course",
            });
        }

        if (type?.type == 'project' && (propertyName != 'projectClassPerformance' && propertyName != 'projectInternalMarks')) {
            return res.status(400).json({
                status: "fail",
                message: "You are trying to add invalid property to project course",
            });
        }

        // if(type.type=='theory' && (propertyName=='theorySecondExaminer'|| propertyName=='theoryThirdExaminer' ))

        //marks gula load kore ante hbe
        const allmarksOfACourse = await getMarksService(courseMarksId);
        const updatedData = allmarksOfACourse.studentsMarks.map((student) => {
            const inputObject = req?.body?.marks?.find(x => {
                return x.id == student.id
            })
            // console.log('inputObject == ', inputObject)
            if (inputObject?.[`${propertyName}`]) {
                student[`${propertyName}`] = inputObject?.[`${propertyName}`]
            }
            // else {
            //     student[`${propertyName}`] = 0
            // }

            // add extra data if project course
            if (allmarksOfACourse?.type == 'project') {
                // console.log('allmarksOfACourse?.type == ', allmarksOfACourse?.type)
                // console.log('inputObject?.[${projectClassPerformanceBy}] == ', inputObject?.[`projectClassPerformanceBy`])
                student[`projectClassPerformanceBy`] = inputObject?.[`projectClassPerformanceBy`]
                student[`projectClassPerformanceByProfileId`] = inputObject?.[`projectClassPerformanceByProfileId`]
            }

            return student;
        })
        // console.log(updatedData)
        const result = await updateMarksService(courseMarksId, updatedData)

        res.status(200).json({
            status: "success",
            message: "Successfully added marks",
            data: result
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add marks",
            error: error.message,
        });
    }
}


exports.updateMarksSecondExaminer = async (req, res, next) => {
    try {
        const user = req.user;
        const { courseMarksId } = req.params;

        //marks gula load korea ante hbe
        const allmarksOfACourse = await getMarksService(courseMarksId);

        if (user.profileId != allmarksOfACourse.secondExaminer[`teacherProfileId`]) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied",
            });
        }

        if (!allmarksOfACourse?.isSubmittedByCourseTeacher) {
            return res.status(403).json({
                status: "fail",
                message: "Other teachers are not yet submitted the marks",
            });
        }

        if (allmarksOfACourse?.isSubmittedBySecondExaminer) {
            return res.status(403).json({
                status: "fail",
                message: "You have already submitted all the marks!",
            });
        }

        const updatedData = allmarksOfACourse.studentsMarks.map((student) => {
            const inputObject = req.body.marks.find(x => {
                return x.id == student.id
            })
            if (inputObject?.theorySecondExaminer) {
                student.theorySecondExaminer = inputObject.theorySecondExaminer
            }
            return student;
        })
        // console.log(updatedData)
        const result = await updateMarksService(courseMarksId, updatedData)

        res.status(200).json({
            status: "success",
            message: "Successfully added marks",
            data: result
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add marks",
            error: error.message,
        });
    }
}


exports.updateMarksThirdExaminer = async (req, res, next) => {
    try {
        const user = req.user;
        const { courseMarksId } = req.params;
        //marks gula load korea ante hbe
        const allmarksOfACourse = await getMarksService(courseMarksId);
        if (!allmarksOfACourse?.isSubmittedByCourseTeacher || !allmarksOfACourse?.isSubmittedBySecondExaminer) {
            return res.status(403).json({
                status: "fail",
                message: "Other teachers are not yet submitted the marks",
            });
        }
        if (allmarksOfACourse?.isSubmittedByThirdExaminer) {
            return res.status(403).json({
                status: "fail",
                message: "You have already submitted all the marks!",
            });
        }
        if (user?.profileId != allmarksOfACourse?.thirdExaminer?.[`teacherProfileId`]) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied",
            });
        }
        const updatedData = allmarksOfACourse.studentsMarks.map((student) => {
            const inputObject = req.body?.marks?.find(x => {
                if (x.id == student.id) {
                    let second = 0
                    let first = 0
                    student?.theoryFinal && (first = parseInt(student.theoryFinal))
                    student?.theorySecondExaminer && (second = parseInt(student.theorySecondExaminer))
                    // console.log(student.id, '  first === ', first, ' second === ', second)
                    if (Math.abs(first - second) > 14) {
                        return x
                    }
                }
            })
            if (inputObject?.theoryThirdExaminer) {
                student.theoryThirdExaminer = inputObject.theoryThirdExaminer
            }
            return student;
        })
        // console.log(updatedData)
        const result = await updateMarksService(courseMarksId, updatedData)

        res.status(200).json({
            status: "success",
            message: "Successfully added marks",
            data: result
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add marks",
            error: error.message,
        });
    }
}


exports.turnInMarksCourseTeacher = async (req, res, next) => {
    try {
        const user = req.user;
        const { courseMarksId } = req.params;
        const type = await getTypeOfACourseService(req.params.courseMarksId);
        const marksOfACourse = await getMarksCourseTeacherService(courseMarksId, type?.type);

        //check if teacher for this course
        if ((user.profileId != marksOfACourse?.teacher?.[`teacherProfileId`]) && !marksOfACourse?.teacherList?.includes(user.profileId)) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied",
            });
        }

        //check for theory and lab
        if (marksOfACourse?.isSubmittedByCourseTeacher) {
            return res.status(403).json({
                status: "fail",
                message: "You have already submitted all the marks!",
            });
        }

        //check for project
        if (type.type == 'project' && marksOfACourse?.isSubmittedByProjectTeacher?.includes(user?.profileId)) {
            return res.status(403).json({
                status: "fail",
                message: "You have already submitted all the marks!",
            });
        }

        const result = turnInMarksCourseTeacherService(courseMarksId, type?.type, user?.profileId)

        res.status(200).json({
            status: "success",
            message: "Successfully turn in",
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to turn in.",
            error: error.message,
        });
    }
}

exports.turnInMarksSecondExaminer = async (req, res, next) => {
    try {
        const user = req.user;
        const { courseMarksId } = req.params;
        const marksOfACourse = await getMarksSecondExaminerService(courseMarksId);

        if ((user.profileId != marksOfACourse?.secondExaminer?.[`teacherProfileId`])) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied",
            });
        }
        if (marksOfACourse?.isSubmittedBySecondExaminer) {
            return res.status(403).json({
                status: "fail",
                message: "You have already submitted all the marks!",
            });
        }
        const result = turnInMarksSecondExaminerService(courseMarksId)

        res.status(200).json({
            status: "success",
            message: "Successfully turn in",
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to turn in.",
            error: error.message,
        });
    }
}

exports.turnInMarksThirdExaminer = async (req, res, next) => {
    try {
        const user = req.user;
        const { courseMarksId } = req.params;
        const marksOfACourse = await getMarksThirdExaminerService(courseMarksId);

        if ((user.profileId != marksOfACourse?.thirdExaminer?.[`teacherProfileId`])) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied",
            });
        }
        if (marksOfACourse?.isSubmittedByThirdExaminer) {
            return res.status(403).json({
                status: "fail",
                message: "You have already submitted all the marks!",
            });
        }
        const result = turnInMarksThirdExaminerService(courseMarksId)

        res.status(200).json({
            status: "success",
            message: "Successfully turn in",
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to turn in.",
            error: error.message,
        });
    }
}

exports.turnInMarksProjectTeacher = async (req, res, next) => {
    try {
        const user = req.user;
        const { courseMarksId } = req.params;
        const marksOfACourse = await getMarksCourseTeacherService(courseMarksId, 'project');
        // console.log(marksOfACourse?.teacherList)
        // console.log(user?.profileId)
        if (!marksOfACourse?.teacherList?.includes(user?.profileId)) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied",
            });
        }
        if (marksOfACourse?.isSubmittedByProjectTeacher?.includes(user?.profileId)) {
            return res.status(403).json({
                status: "fail",
                message: "You have already submitted all the marks!",
            });
        }
        const result = turnInMarksProjectTeacherService(courseMarksId, user?.profileId)

        res.status(200).json({
            status: "success",
            message: "Successfully turn in",
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to turn in.",
            error: error.message,
        });
    }
}



exports.updateMarksExamCommittee = async (req, res, next) => {
    try {
        const user = req.user;
        const { courseMarksId } = req.params;
        const { propertyName } = req.body;
        // console.log('propertyName ', propertyName);
        // console.log('req.body ', req.body);
        const validProperty = ['labExperiment', 'labViva', 'projectPresentation'];
        if (!validProperty.includes(propertyName)) {
            return res.status(400).json({
                status: "fail",
                message: "You are not authorized to add the following property",
            });
        }
        const result = await getAllMarksOfStudentsOfACourseService(courseMarksId);
        if (!(result?.semesterId?.examCommitteeChairman == user?.profileId) && !(result?.semesterId?.examCommittee.includes(user?.profileId))) {
            // console.log('found');
            // isExamCommittee=false;
            return res.status(400).json({
                status: "fail",
                message: "You are not in exam comittee.",
            });
        }

        //for theory course exam comittee will not insert any marks
        if (result.type === 'theory') {
            return res.status(400).json({
                status: "fail",
                message: "This is a theory course.",
            });
        }
        if (result.type == 'lab' && propertyName == 'projectPresentation') {
            return res.status(400).json({
                status: "fail",
                message: "Lab course can't have project presentation marks",
            });
        }
        if (result.type == 'project' && propertyName == 'labExperiment') {
            return res.status(400).json({
                status: "fail",
                message: "Project course can't have lab experiment marks",
            });
        }

        const updatedData = result.studentsMarks.map((student) => {
            const inputObject = req.body.marks.find(x => {
                return x.id == student.id
            })
            // console.log('inputObject == ', inputObject)
            if (inputObject?.[`${propertyName}`]) {
                student[`${propertyName}`] = inputObject?.[`${propertyName}`];
                student[`${propertyName}By`] = user?.fullName;
            }
            return student;
        })
        // console.log(updatedData)
        const output = await updateMarksService(courseMarksId, updatedData)

        res.status(200).json({
            status: "success",
            message: "Successfully added marks",
            data: output
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add marks",
            error: error.message,
        });
    }
}





// addStudent will call when chairman approve an application
exports.addStudent = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await getCoursesMarksService(data.courses)
        // console.log('result ', result);
        let results = result.map(async (course) => {
            let found = false;
            course.studentsMarks.map(async (student) => {
                if (student.studentProfileId == data.studentProfileId) {
                    found = true;
                    return;
                }
            })
            if (found == false) {
                // push the student to that course
                console.log('not found me on ', course.courseCode);
                course.setStudent({ id: data.id, studentProfileId: data.studentProfileId })
                await course.save({ validateBeforeSave: false })
            }
        })
        await Promise.all(results)
        return res.status(200).json({
            status: "success",
            message: "Successfully added student and their taken courses",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add student and their taken courses",
            error: error.message,
        });
    }
}

// addPaymentInfo will call when academic section verfiy a payment and approve the application
exports.addPaymentInfo = async (req, res, next) => {
    try {
        const data = req.body;
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
        return res.status(200).json({
            status: "success",
            message: "Successfully update this student's payment info ",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to update this student's payment info",
            error: error.message,
        });
    }
}


exports.getAllMarksOfStudentsOfACourse = async (req, res, next) => {
    try {
        const { courseMarksId } = req.params;
        const user = req.user;
        const result = await getAllMarksOfStudentsOfACourseService(courseMarksId);
        if (result?.semesterId?.examCommitteeChairman == user?.profileId || result?.semesterId?.examCommittee.includes(user?.profileId)) {
            // console.log('found');
            return res.status(200).json({
                status: "success",
                message: "Successfully loaded student of a course and their marks",
                data: result
            });
        }
        else {
            res.status(400).json({
                status: "fail",
                message: "You are not in exam comittee",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load marks of the course",
            error: error.message,
        });
    }
}

exports.getTakenCourses = async (req, res, next) => {
    try {
        const { state, profileId } = req.params;
        const result = await getTakenCoursesService(profileId, state)
        return res.status(200).json({
            status: "success",
            message: "Successfully loaded taken courses",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load taken courses",
            error: error.message,
        });
    }
}


exports.getTeachersForACourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const teachers = await getTeachersForACourseService(courseId)
        res.status(200).json({
            status: "success",
            message: "Teachers loaded successfully!",
            data: teachers,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load teachers.",
            error: error.message,
        });
    }
}