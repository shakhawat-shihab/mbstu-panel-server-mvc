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
}

exports.getStudentSemesterCodeService = async (studentProfileId) => {
    // // const result = await StudentResult.find({ semesterCode: 1 }).select('id').populate({ path: 'studentProfile', select: 'name' });
    // console.log(studentProfileId);
    const result = await StudentResult.findOne({ studentProfile: studentProfileId }).select('semesterCode')
    // console.log(result);
    return result;
}

exports.publishResultService = async (data) => {
    // console.log(data)
    const studentResultValue = await StudentResult.find({
        studentProfile: { $in: ['6354f187f9ff3a3298aa4d6e', '6358fde1356e33f6ca0d5033'] }
    })
    const query = [];
    console.log('studentResultValue  ==  ', studentResultValue)
    studentResultValue?.map(stu => {
        console.log('stu.coursesMarks  ==  ', stu.coursesMarks)
        //console.log('data?.students?.[`${stu?.id}`]?.[`${x?.courseCode}`]  ==  ', data?.students?.[`${stu?.id}`]?.[`cse1201`])
        if (stu?.coursesMarks.length == 0) {
            console.log('empty  ')
            const array = [];
            for (const iterator in data?.students?.[`${stu?.id}`]) {
                // console.log(iterator)
                array.push(data?.students?.[`${stu?.id}`]?.[`${iterator}`]);
            }
            const val = {
                updateOne: {
                    filter: { id: stu?.id },
                    update: {
                        $set: { coursesMarks: array }
                    }
                }
            }
            query.push(val);
        }
        else {
            console.log('non empty  ')
            const array = []
            stu?.coursesMarks.map(x => {
                // console.log(stu?.id, x?.courseCode, data?.students?.[`${stu?.id}`]?.[`${x?.courseCode}`])
                //course already exists
                if (x?.courseCode === data?.students?.[`${stu?.id}`]?.[`${x?.courseCode}`]?.courseCode) {
                    // console.log('inside    = ', stu?.id, x?.courseCode)
                    //marks increased
                    if (x?.theoryFinal < data?.students?.[`${stu?.id}`]?.[`${x?.courseCode}`]?.theoryFinal) {
                        const nw = data?.students?.[`${stu?.id}`]?.[`${x?.courseCode}`];
                        nw.theoryFinal = nw.theoryFinal;
                        console.log('nw                 ==> ', nw)
                        array.push(nw)
                    }
                    //marks not increased
                    else {
                        array.push(x)
                    }
                }
                //course not exist
                else {
                    array.push(x)
                    // query.push(val);
                }
            })
            console.log('array === ', array)
            const val = {
                updateOne: {
                    filter: { id: stu?.id },
                    update: {
                        $set: { coursesMarks: array }
                    }
                }
            }
            query.push(val);
        }
        console.log(query);

    })


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
    await StudentResult.bulkWrite(query);
    return query;
}