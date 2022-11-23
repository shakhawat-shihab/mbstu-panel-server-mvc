const { getUserService, signUpService, logInService, findUserByEmailService, findUserByToken, findUserByEmailExceptPasswordService, findUserLikeEmailExceptPasswordService, addTeacherService, getTeacherByDeptService, addDeptChairmanService, addAcademicCommitteeService, getDeptChairmanService, removeAcademicCommitteeService } = require("../services/user.service");
const User = require("../models/User");
const { generateToken } = require("../utils/token");
const { sendMailWithGmail } = require("../utils/email");
const { createProfileService } = require("../services/profile.service");
const { idCodeToDept } = require("../functions/convertFunction");
const { createStudentResultService } = require("../services/studentsResult.service");
const { findStudentInhallServic, findStudentInhallService } = require("../services/hall.service");
const Hall = require("../models/Hall");


exports.getUser = async (req, res, next) => {
    try {
        const users = await getUserService()
        res.status(200).json({
            status: "success",
            messgae: "Data loaded successfully!",
            data: users,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: " Data failed to load ",
            error: error.message,
        });
    }
}


exports.signUp = async (req, res, next) => {
    try {
        const user = await signUpService(req.body);
        const token = user.generateConfirmationToken();
        await user.save({ validateBeforeSave: false });
        // const mailData = {
        //     to: [user.email],
        //     subject: "Verify your Account For ACC Job Portal",
        //     text: `Thank you for creating your account. Please confirm your account here: ${req.protocol
        //         }://${req.get("host")}${req.originalUrl}/confirmation/${token}`,

        // };
        // await sendMailWithGmail(mailData)

        res.status(200).json({
            status: "success",
            message: "Successfully signed up.",
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to sign up!",
            error: error.message,
        });
    }
}



/**
    1. check if email and password is given
    2. load user by email
    3. if no user found then wrong email, then send response
    4. compare password
    5. if password mismatched then wrong password, then send response
    6. check if the user status is not active, then send response
    7. generate token 
    8. send user and token
 */

exports.logIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //1
        if (!email || !password) {
            return res.status(401).json({
                status: "fail",
                message: "Enter email and password",
            });
        }
        //2
        const user = await findUserByEmailService(email);
        //3
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "No User with this email",
            });
        }
        //4
        const checkPassword = user.comparePassword(password, user?.password)
        //5
        if (!checkPassword) {
            return res.status(403).json({
                status: "fail",
                message: "Wrong password inserted",
            });
        }
        //6
        if (user?.status !== 'active') {
            return res.status(401).json({
                status: "fail",
                message: "Your account is not active yet.",
            });
        }
        //7
        const token = generateToken(user);
        //8
        const { password: pws, ...other } = user.toObject();
        res.status(200).json({
            status: "success",
            message: "Successfully logged in",
            data: {
                other,
                token
            }
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to log in",
            error: error.message,
        });
    }
}

exports.getMe = async (req, res, next) => {
    try {
        const { user } = req;
        const userAllInfo = await findUserLikeEmailExceptPasswordService(user?.email);
        res.status(200).json({
            status: "success",
            message: "Successfully logged in",
            data: userAllInfo
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to log in",
            error: error.message,
        });
    }
}


exports.confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await findUserByToken(token);

        if (!user) {
            return res.status(403).json({
                status: "fail",
                error: "Invalid token"
            });
        }
        const expired = new Date() > new Date(user.confirmationTokenExpires);
        if (expired) {
            return res.status(401).json({
                status: "fail",
                error: "Token expired"
            });
        }

        const profile = {}
        let student = false;
        if (/^[a-z]{2}\d{5}/.test(user.email) && user.email.endsWith('@mbstu.ac.bd')) {
            student = true;
            const id = user.email.substring(0, 7);
            let session = user.email.substring(2, 4);
            session = '20' + parseInt(session) - 1 + '-' + session;
            // console.log(session);
            //profile
            profile.id = id;
            profile.session = session;
            profile.email = user.email;
            profile.firstName = user?.firstName;
            profile.lastName = user?.lastName;
            //user
            user.department = idCodeToDept(id);
            user.isStudent = true;
        }
        else {
            profile.email = user.email;
            profile.firstName = user?.firstName;
            profile.lastName = user?.lastName;
        }

        //profile create
        const profileResult = await createProfileService(profile);

        // student result create
        if (student) {
            const getHall = await findStudentInhallService(user.email.substring(0, 7));
            const obj = { name: getHall.name, hallId: getHall._id }
            user.hall = obj;
            const studentResult = await createStudentResultService({ id: user.email.substring(0, 7), department: user.department, studentProfile: profileResult?._id, semesterCode: 0 });
            // console.log(' studentResult ', studentResult)
        }

        user.status = "active";
        user.firstName = undefined;
        user.lastName = undefined;
        user.confirmationToken = undefined;
        user.confirmationTokenExpires = undefined;
        user.profile = profileResult._id;
        //user save
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: "success",
            message: "Successfully activated your account.",
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            status: "fail",
            error,
        });
    }
};


// exports.findUserByEmail = async (req, res, next) => {
//     try {
//         const { email } = req.params;
//         const user = await findUserByEmailExceptPasswordService(email);
//         res.status(200).json({
//             status: "success",
//             message: "Loaded the users",
//             data: user
//         });
//     } catch (error) {
//         res.status(400).json({
//             status: "fail",
//             message: "Failed to load",
//             error: error.message,
//         });
//     }
// }

exports.findUserLikeEmail = async (req, res, next) => {
    try {
        const { email } = req.params;
        const user = await findUserLikeEmailExceptPasswordService(email);
        res.status(200).json({
            status: "success",
            message: "Loaded the users",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load",
            error: error.message,
        });
    }
}





exports.addTeacher = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { department } = req.user;
        const result = await addTeacherService(userId, department);
        if (result?.modifiedCount) {
            return res.status(200).json({
                status: "success",
                message: "Successfully added teacher",
            });
        }
        res.status(400).json({
            status: "fail",
            message: "Failed to add Teacher",
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add Teacher",
            error: error.message,
        });
    }
}

exports.addAcademicCommittee = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const result = await addAcademicCommitteeService(userId);

        res.status(200).json({
            status: "success",
            message: "Successfully added to academic committee",
        });

    } catch (error) {

        res.status(400).json({
            status: "fail",
            message: "Failed to add in academic committee",
            error: error.message,
        });
    }
}

exports.removeAcademicCommittee = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const result = await removeAcademicCommitteeService(userId);

        res.status(200).json({
            status: "success",
            message: "Successfully removed from academic committee",
        });

    } catch (error) {

        res.status(400).json({
            status: "fail",
            message: "Failed removed from academic committee",
            error: error.message,
        });
    }
}

exports.getDeptChairman = async (req, res, next) => {
    try {
        const { department } = req.params;
        // console.log(department);
        const result = await getDeptChairmanService(department);
        if (result) {
            return res.status(200).json({
                status: "success",
                message: "Successfully loaded current chairman",
                data: result
            });
        }
        res.status(404).json({
            status: "fail",
            message: "There is no chairman with this email for this department",
            data: {}
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to load chairman",
            error: error.message,
        });
    }
}


exports.addDeptChairman = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { department } = req.params;
        const result = await addDeptChairmanService(userId, department);
        if (result?.modifiedCount) {
            return res.status(200).json({
                status: "success",
                message: "Successfully added chairman",
            });
        }
        res.status(400).json({
            status: "fail",
            message: "Failed to add chairman",
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add chairman",
            error: error.message,
        });
    }
}


exports.getTeacherByDept = async (req, res, next) => {
    try {
        const queries = {}
        if (req.query.fields) {
            let fieldsArray = req.query.fields.split(',');
            queries.departmentArray = fieldsArray
        }
        // console.log(queries);
        const data = await getTeacherByDeptService(queries);
        res.status(200).json({
            status: "success",
            message: "Successfully loaded teacher",
            data: data
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add Teacher",
            error: error.message,
        });
    }
}


exports.addHallProvost = async (req, res, next) => {
    try {
        const { hallId, hallProvostProfileId, hallProvostName, hallName } = req.body;
        const { department } = req.user;

        //get hall data
        const hall = await Hall.findOne({ _id: hallId });

        //get current hall Provost
        const currentHallProvost = hall.hallProvost;
        console.log('currentHallProvost ', currentHallProvost)

        //update user ====>> remove the hall info from current hall provost user info
        const o = await User.updateOne({ profile: currentHallProvost?.profileId }, { $set: { hall: {}, isHallProvost: false } })
        console.log(o)

        //set new hall provost
        hall.setHallProvost({ name: hallProvostName, profileId: hallProvostProfileId });
        const result = await hall.save()
        // console.log(result)


        ////add the hall info to current hall provost user info
        const output = await User.updateOne({ profile: hallProvostProfileId }, { $set: { hall: { name: hallName, hallId: hallId }, isHallProvost: true } })
        console.log(output)

        return res.status(200).json({
            status: "success",
            message: "Successfully added Hall Provost",
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to add Hall Provost",
            error: error.message,
        });
    }
}