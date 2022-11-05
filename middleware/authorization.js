module.exports = (...role) => {
    return (req, res, next) => {
        // const userRole = req.user;
        const userRole = [];
        req?.user?.isStudent && userRole.push('student');
        req?.user?.isTeacher && userRole.push('teacher');
        req?.user?.isDeptChairman && userRole.push('dept-chairman');
        req?.user?.isHallProvost && userRole.push('hall-provost');
        req?.user?.isAcademicCommittee && userRole.push('academic-committee');

        const givenAccess = role[0].split(',');
        // console.log('role  =  ', role)
        // console.log('givenAccess  =  ', givenAccess)
        // console.log('userRole  =  ', userRole)

        let found = false;
        givenAccess?.find(r => {
            if (userRole.includes(r?.trim())) {
                found = true;
                return;
            }
        })
        // console.log(found);
        if (!found) {
            return res.status(403).json({
                status: "fail",
                error: 'You are not authorized to access it',
            });
        }
        next()
    }
}
