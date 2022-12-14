const Profile = require("../models/Profile");
const User = require("../models/User");

exports.getUserService = async () => {
    const users = await User.find({});
    return users;
}
exports.signUpService = async (user) => {
    const result = await User.create(user);
    return result;
}
exports.logInService = async (logInInfo) => {
    console.log(logInInfo)
    // const result = await User.create(user);
    // return result;
}

exports.findUserByEmailService = async (email) => {
    const user = await User.findOne({ email }).populate('profile')
    return user;
}
exports.findUserByEmailExceptPasswordService = async (email) => {
    const user = await User.findOne({ email })
        .select('-password')
        .populate('profile');
    return user;
}
exports.findUserLikeEmailExceptPasswordService = async (email) => {
    // let regExp = new RegExp(email);
    // let regExp = new RegExp(`\\b${email}\\b`, 'gi');
    const user = await User.find({ "email": { $regex: email } })
        .select('-password')
        .populate('profile')
        .limit(10)
    return user;
}

exports.findUserByToken = async (token) => {
    return await User.findOne({ confirmationToken: token });
};

exports.findUserByPasswordResetToken = async (token) => {
    return await User.findOne({ resetPasswordToken: token });
};

exports.addTeacherService = async (_id, department) => {
    const result = await User.updateOne({ _id }, { $set: { isTeacher: true, department: department } })
    return result;
}
exports.removeTeacherService = async (_id, department) => {
    const result = await User.updateOne({ _id }, { $set: { isTeacher: false, department: '' } })
    return result;
}


exports.getDeptChairmanService = async (department) => {
    const result = await User.findOne({ department: department, isDeptChairman: true })
        .select('-password')
        .populate('profile');
    return result;
}

exports.addDeptChairmanService = async (_id, department) => {
    const currentChairman = await User.updateOne({ isDeptChairman: true, department: department }, { $set: { isDeptChairman: false } });
    const result = await User.updateOne({ _id }, { $set: { isDeptChairman: true, department: department } })
    return result;
}

exports.addAcademicCommitteeService = async (_id) => {
    const result = await User.updateOne({ _id }, { $set: { isAcademicCommittee: true } })
    return result;
}
exports.removeAcademicCommitteeService = async (_id) => {
    const result = await User.updateOne({ _id }, { $set: { isAcademicCommittee: false } })
    return result;
}

exports.getTeacherByDeptService = async (queries) => {
    // console.log(queries);
    const result = await User.find({ isTeacher: true, department: { $in: queries?.departmentArray } })
        .select('email department profile')
        .populate('profile');
    return result;
}