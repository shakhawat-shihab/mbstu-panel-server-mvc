const { addStudentService, getCourseMarksService } = require("../services/marks.service");


exports.updateMarks = async (req, res, next) => {
    try {

        //marks gula load korea ante hbe

        res.status(200).json({
            status: "success",
            message: "Successfully created the Semester",
            data: marks
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to create the Semester",
            error: error.message,
        });
    }
}

// it will call when chairman approve an application
exports.addStudent = async (req, res, next) => {
    try {
        const data = req.body;


        const result = await getCourseMarksService(data)

        console.log('result ', result);
        result.map(course => {
            let found = false;
            course.studentsMarks.map(student => {
                if (student.studentProfileId == data.studentProfileId) {
                    found = true;
                    return;
                }
            })
            if (found == false) {
                // push the student to that course
                console.log('not found me on ', course.courseCode);
            }
        })


        // const result = await addStudentService(data);



        // const arrOfCoursesObjectId = []
        // let results = courses.map(async (x) => {
        //     x.semesterId = semester._id;
        //     x.studentsMarks = previousSemesterStudents;
        //     const result = await createMarksService(x);
        //     //const { courseCode, courseTitle, teacher, _id: courseMarksId } = result;
        //     // const obj = { courseCode, courseTitle, teacher, courseMarks }
        //     // console.log('obj === ', obj)
        //     arrOfCoursesObjectId.push(result?._id);
        // })
        // results = await Promise.all(results)






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