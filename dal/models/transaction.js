var mongoose = require("mongoose");

// Transaction Schema - Source, Destination, Sum, isPending, isCanceled.
var transactionSchema = new mongoose.Schema({
    source: String,
    destination: String,
    sum: Number,
    isPending: Boolean,
    isCanceled: Boolean
});

module.exports = mongoose.model("Transaction", transactionSchema);