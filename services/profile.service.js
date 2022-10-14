const Profile = require("../models/Profile");

exports.createProfileService = async (data) => {
    const result = await Profile.create(data);
    return result;
}