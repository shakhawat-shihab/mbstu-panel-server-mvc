const mongoose = require('mongoose')
const validator = require('validator')
const { ObjectId } = mongoose.Schema.Types;
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
        required: [true, "Please provide a email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        validate: {
            validator: (value) => {
                validator.isStrongPassword(value, {
                    minLength: 6,
                    // minLowerCase: 1,
                    // minUpperCase: 1,
                    // minNumber: 1,
                    // minSymbol: 1
                })
            },
            message: 'Password {VALUE} is not strong enough'
        }
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Passwords don't match!",
        },
    },
    department: {
        type: String,

    },
    isStudent: {
        type: Boolean,
    },
    isTeacher: {
        type: Boolean,
    },
    isDeptChairman: {
        type: Boolean,
    },
    isHallProvost: {
        type: Boolean,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        default: 'inactive'
    },
    profile: {
        type: ObjectId,
        ref: "profile",
        // required: true,
    },
    hall: {
        name: {
            type: String
        },
        hallId: {
            type: ObjectId
        }
    },
    confirmationToken: String,
    confirmationTokenExpires: Date,

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true
})


userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        //  only run if password is modified, otherwise it will change every time we save the user!
        return next();
    }
    const password = this.password;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    this.password = hashedPassword;
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.comparePassword = function (planePassword, hashPassword) {
    const isPasswordValid = bcrypt.compareSync(planePassword, hashPassword);
    return isPasswordValid
}

// for mail verification
userSchema.methods.generateConfirmationToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.confirmationToken = token;
    const date = new Date();
    date.setDate(date.getDate() + 1);
    this.confirmationTokenExpires = date;
    return token;
};

const User = mongoose.model("user", userSchema);

module.exports = User;