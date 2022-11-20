const Semester = require("../models/Semester");
const StudentResult = require("../models/StudentResult");

exports.createStudentResultService = async (data) => {
    const result = await StudentResult.create(data);
    return result;
}

exports.getStudentOfPreviousSemesterService = async (semesterCode) => {
    // const result = await StudentResult.find({ semesterCode: 1 }).select('id').populate({ path: 'studentProfile', select: 'name' });
    const result = await StudentResult.find({ semesterCode: semesterCode }).select('studentProfile id')
    return result;
}

exports.getStudentResultService = async (studentProfileId) => {
    // // const result = await StudentResult.find({ semesterCode: 1 }).select('id').populate({ path: 'studentProfile', select: 'name' });
    // const result = await StudentResult.find({ semesterCode: semesterCode }).select('studentProfile id')
    // return result;
    const result = await StudentResult.findOne({ studentProfile: studentProfileId })
        .populate('semesterIds')
    return result
}

exports.getStudentSemesterCodeService = async (studentProfileId) => {
    // // const result = await StudentResult.find({ semesterCode: 1 }).select('id').populate({ path: 'studentProfile', select: 'name' });
    // console.log(studentProfileId);
    const result = await StudentResult.findOne({ studentProfile: studentProfileId }).select('semesterCode')
    // console.log(result);
    return result;
}



/*update semester code if minimum 1 course is pased and current semester code = publishing result semester code*/
exports.publishResultService = async (data) => {
    // console.log('data =====>>> ', data)
    const semesterId = data?.semesterId;
    // const semester = await Semester.findOne({ _id: semesterId });
    // console.log('semester   ==> ', semester)

    const studentResultValue = await StudentResult.find({
        studentProfile: { $in: data.profileIdarray }
    })

    const query = [];
    // console.log('studentResultValue  ==>>>>   ', studentResultValue)
    studentResultValue?.map(stu => {
        // console.log('stu.coursesMarks  ==>>>>  ', stu.coursesMarks)
        //console.log('data?.students?.[`${stu?.id}`]?.[`${x?.courseCode}`]  ==  ', data?.students?.[`${stu?.id}`]?.[`cse1201`])

        //if no result of a particular student is published, then "stu?.coursesMarks" array is empty
        if (stu?.coursesMarks.length == 0) {
            console.log('empty  ')
            const array = [];
            for (const course in data?.students?.[`${stu?.id}`]) {
                if (course != 'creditEarned') {
                    // console.log('course ==> ', data?.students?.[`${stu?.id}`]?.[`${course}`])
                    array.push(data?.students?.[`${stu?.id}`]?.[`${course}`])
                }
            }

            let val = {}
            // semester code match means the student is passed
            if ((stu.semesterCode + 1) == data.semesterCode && data?.students?.[`${stu?.id}`]?.[`creditEarned`] > 0) {
                // console.log('matched  ', data.semesterCode)
                // console.log('pushinghgggggggggggggggggggg  first')
                val = {
                    updateOne: {
                        filter: { id: stu?.id },
                        update: {
                            $set: { coursesMarks: array, semesterCode: data.semesterCode },
                            $push: { semesterIds: semesterId },
                        }
                    }
                }
            }
            else {
                val = {
                    updateOne: {
                        filter: { id: stu?.id },
                        update: {
                            $set: { coursesMarks: array }
                        }
                    }
                }
            }

            query.push(val);
        }
        //else,  result of a particular student is published, then "stu?.coursesMarks" array is non empty
        else {
            console.log('non empty  ')
            const array = []
            stu?.coursesMarks.map(x => {
                // console.log(stu?.id, x?.courseCode, data?.students?.[`${stu?.id}`]?.[`${x?.courseCode}`])
                //course matched with new data, so update it
                if (x?.courseCode === data?.students?.[`${stu?.id}`]?.[`${x?.courseCode}`]?.courseCode) {
                    const nw = data?.students?.[`${stu?.id}`]?.[`${x?.courseCode}`];
                    if (x.type == 'theory') {
                        // theory thirty percent will only update when student attend in CT exam
                        !nw.theoryThirty && (nw.theoryThirty = x?.theoryThirty);
                        array.push(nw);
                    }
                    else if (x.type == 'lab') {
                        !nw.labClass && (nw.labClass = x?.labClass);
                        array.push(nw);
                    }
                    else if (x.type == 'project') {
                        !nw.projectClass && (nw.projectClass = x?.projectClass);
                        array.push(nw);
                    }
                    delete data?.students?.[`${stu?.id}`]?.[`${x?.courseCode}`];
                }
                //course in DB not matched with new data, so push previously stored data
                else {
                    array.push(x)
                }
            })

            // the courses which is in the req.data, but not in mongoDB
            for (const course in data?.students?.[`${stu?.id}`]) {
                if (course != 'creditEarned') {
                    // console.log('course ==> ', data?.students?.[`${stu?.id}`]?.[`${course}`])
                    array.push(data?.students?.[`${stu?.id}`]?.[`${course}`])
                }
            }

            let val = {}
            // console.log('array === ', array)

            // console.log('data.semesterCode   ', data.semesterCode)
            // console.log('stu.semesterCode  ', stu.semesterCode)
            if ((stu.semesterCode + 1) == data.semesterCode && data?.students?.[`${stu?.id}`]?.[`creditEarned`] > 0) {
                // console.log('matched  ', data.semesterCode)
                // console.log('pushinghgggggggggggggggggggg')
                val = {
                    updateOne: {
                        filter: { id: stu?.id },
                        update: {
                            $set: { coursesMarks: array, semesterCode: data.semesterCode },
                            $push: { semesterIds: semesterId },
                        }
                    }
                }
            }
            else {
                val = {
                    updateOne: {
                        filter: { id: stu?.id },
                        update: {
                            $set: { coursesMarks: array }
                        }
                    }
                }
            }


            query.push(val);
        }
        // console.log('query   ===>>> ', query);

    })
    // console.log('data === ', data)


    // const updateQueries = [];
    // data.forEach(async (item) => {
    //     const profileId = _id?.profile;
    //     if (item?.type == 'theory') {
    //         { arrayFilters: [{ "score": { $gte: 8 } }] }
    //         updateQueries.push({
    //             updateOne: {
    //                 filter: { studentProfile: profileId },
    //                 // update: { number: item.number },
    //                 update: { $set: { "coursesMarks.$[elem].thirtyPercent": 70 } },
    //                 arrayFilters: [{ "elem.thirtyPercent": { $lt: 85 } }]
    //             },
    //         });
    //     }
    //     updateQueries.push({
    //         updateOne: {
    //             filter: { studentProfile: profileId },
    //             update: { number: item.number },
    //         },
    //     });
    // });
    // await this.itemModel.bulkWrite(updateQueries);

    const result = await StudentResult.bulkWrite(query);
    // return result;
    return query;
}