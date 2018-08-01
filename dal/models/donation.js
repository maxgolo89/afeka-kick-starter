var mongoose = require("mongoose");

// Donation Schema - Donor, Project, Amount, Time Stamp
var donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    },
    timeStamp: Date
});

module.exports = mongoose.model("Donation", donationSchema);