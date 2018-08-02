var PROJECTLOGICERROR = [
    "",
    "Genetic Error",
    "Project doesn't exist",
    "Project name already taken",
    "Missing Input"
];


/** Check project status (Is Kicked Out)
 * Params: Number targetSum, Number currentSum, Date targetDate, callback. */
module.exports.isKickedOut = function(targetSum, currentSum, targetDate) {
    if(!targetSum || !currentSum || !targetDate)
        return false;
    else if(targetSum <= currentSum && targetDate <= Date.now()) {
        return true;
    } else {
        return false;
    }
}

/** Check Project Status (Is Expired)
 * Params: Number targetSum, Number currentSum, Date targetDate, callback. */
module.exports.isExpired = function(targetSum, currentSum, targetDate) {
    if(!targetSum || !currentSum || !targetDate)
        return false;
    else if(targetSum > currentSum && targetDate <= Date.now()) {
        return true;
    } else {
        return false;
    }
}

/** Check Project Status (Is Goal Reached and Still Active)
 * Params: Number targetSum, Number currentSum, Date targetDate, callback. */
module.exports.isGoalReached = function(targetSum, currentSum, targetDate) {
    if(!targetSum || !currentSum || !targetDate)
        return false;
    else if(targetSum <= currentSum && targetDate > Date.now()) {
        return true;
    } else {
        return false;
    }
}