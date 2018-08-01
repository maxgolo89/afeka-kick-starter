var mongoose = require("mongoose");

// Project - name, description, video, images, targetDate, targetSum, currentSum
var projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    images: [String],
    video: String,
    targetSum: Number,
    currentSum: Number,
    targetDate: Date,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    expired: Boolean,
    bankAccount: Number
});

module.exports = mongoose.model("Project", projectSchema);