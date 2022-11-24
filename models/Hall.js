const mongoose = require('mongoose')
const validator = require('validator');
const { ObjectId } = mongoose.Schema.Types;
const hallSchema = mongoose.Schema({
    name: {
        // banga bandhu sheikh majibur rahman hall
        type: String,
        trim: true,
        minLength: 10,
        maxLength: 100,
        required: true,
    },
    codeName: {
        //bsmrh
        type: String,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 100,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    contactNumber: {
        type: String,
        validate: [validator.isMobilePhone, "Please provide a mobile number"]
    },
    imageURL: {
        type: String,
        validate: [validator.isURL, "Please provide a url"]
    },
    hallProvost: {
        name: {
            type: String,
        },
        userId: {
            type: ObjectId,
            ref: 'user'
        }
    },
    studentsIds: [{
        type: String,
        lowercase: true
    }],
    studentsProdileIds: [{
        type: ObjectId,
    }],
}, {
    timestamps: true
})

hallSchema.methods.setHallProvost = function (data) {
    this.hallProvost = data;
};

const Hall = mongoose.model("hall", hallSchema);

module.exports = Hall;