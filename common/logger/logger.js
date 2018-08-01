function getCurrentTimeString() {
    var arr
    var date = new Date();
    return date.toLocaleString();
}



module.exports = {
    err: function(tag, msg) {
        var date = new Date();
        console.error("[" + getCurrentTimeString() + "]" + " [" + tag + "] " + msg);
    },
    info: function(tag, msg) {
        console.log("[" + getCurrentTimeString() + "]" + " [" + tag + "] " + msg);
    }
}