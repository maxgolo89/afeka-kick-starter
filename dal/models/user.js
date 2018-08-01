var mongoose = require("mongoose");

// User schema - Entrepreneur, Donor, Administrator, Active
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: String,
    isActive: Boolean
});

module.exports = mongoose.model("User", userSchema);