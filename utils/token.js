const jwt = require('jsonwebtoken')
exports.generateToken = (userInfo) => {
    console.log(userInfo);
    const payload = {
        id: userInfo?._id,
        profileId: userInfo?.profile[`_id`],
        fullName: userInfo?.profile?.firstName + ' ' + userInfo?.profile?.lastName,
        email: userInfo?.email,
        department: userInfo?.department,
        hall: {
            name: userInfo?.hall?.name,
            hallId: userInfo?.hall?.hallId
        },
        isStudent: userInfo?.isStudent,
        isTeacher: userInfo?.isTeacher,
        isDeptChairman: userInfo?.isDeptChairman,
    }
    // console.log('TOKEN_SECRET ', process.env.TOKEN_SECRET);
    // crypto.randomBytes(64).toString('hex')  => process.env.TOKEN_SECRET
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '10h'
    })
    return token;
}