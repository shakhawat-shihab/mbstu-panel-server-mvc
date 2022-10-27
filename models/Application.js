const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const validator = require('validator')

const applicationSchema = mongoose.Schema({


}, {
    timestamps: true
})

const Application = mongoose.model('application', applicationSchema)
module.exports = Application;