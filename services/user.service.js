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
    const user = await User.findOne({ email })
    return user;
}
exports.findUserByEmailExceptPasswordService = async (email) => {
    const user = await User.findOne({ email })
        .select('-password')
        .populate('profile');
    return user;
}
exports.findUserLikeEmailExceptPasswordService = async (email) => {
    let regExp = new RegExp(email);
    const user = await User.find({ "email": regExp })
        .select('-password')
        .populate('profile');
    return user;
}

exports.findUserByToken = async (token) => {
    return await User.findOne({ confirmationToken: token });
};

exports.addTeacherService = async (_id) => {
    const result = await User.updateOne({ _id }, { $set: { isTeacher: true } })
    return result;
}