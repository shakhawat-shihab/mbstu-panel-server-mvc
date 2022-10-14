const jwt = require('jsonwebtoken')
exports.generateToken = (userInfo) => {
    const payload = {
        id: userInfo?._id,
        fullname: userInfo?.firstName + ' ' + userInfo?.lastName,
        email: userInfo?.email,
        isStudent: userInfo?.isStudent,
        isTeacher: userInfo?.isTeacher,
        // role: userInfo?.role
    }
    // crypto.randomBytes(64).toString('hex')  = process.env.TOKEN_SECRET
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '10h'
    })
    return token;
}