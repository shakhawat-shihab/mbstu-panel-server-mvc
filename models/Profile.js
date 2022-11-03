const mongoose = require('mongoose')
const validator = require('validator')
const { ObjectId } = mongoose.Schema.Types;
const profileSchema = mongoose.Schema({
    id: {
        type: String,
        trim: true,
        minLength: 7,
        maxLength: 100,
    },
    firstName: {
        type: String,
        trim: true,
        // required: [true, "Please provide a first name"],
        minLength: 3,
        maxLength: 100,
    },
    lastName: {
        type: String,
        trim: true,
        // required: [true, "Please provide a last name"],
        minLength: 3,
        maxLength: 100,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
        // required: [true, "Please provide a email"],
    },
    department: {
        type: String,
    },
    session: {
        type: String,
    },
    contactNumber: {
        type: String,
        validate: [validator.isMobilePhone, "Please provide a mobile number"]
    },
    imageURL: {
        type: String,
        validate: [validator.isURL, "Please provide a url"]
    },
    address: {
        type: String,
    },

}, {
    timestamps: true
})



const Profile = mongoose.model("profile", profileSchema);

module.exports = Profile;