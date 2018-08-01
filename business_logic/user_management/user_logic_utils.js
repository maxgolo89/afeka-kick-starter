var USERLOGICERROR = [
    "",
    "Genetic Error",
    "User doesn't exist",
    "Username already taken",
    "Missing Input",
    "Wrong Password"
];

module.exports.isAdmin = function(type) {
    if(!type || type != 1)
        return false;
    else
        return true;
}

module.exports.isDonor = function(type) {
    if(!type || type != 3)
        return false;
    else
        return true;
}

module.exports.isEntrepreneur = function(type) {
    if(!type | type != 2)
        return false;
    else
        return true;
}

/** Resolve string user type to number
 * 1     - Administrator
 * 2     - Entrepreneur
 * 3     - Donor
 * -1    - UnAuthenticated */
module.exports.resolveUserAuthLvl = function(user) {
    if(user == null)
        return -1;

    switch(user.type) {
        case "Administrator":
            return 1;
        case "Entrepreneur":
            return 2;
        case "Donor":
            return 3;
        default:
            return -1;
    }
}

/** Resolve number user type to string
 * 1     - Administrator
 * 2     - Entrepreneur
 * 3     - Donor
 * -1    - UnAuthenticated */
module.exports.resolveUserAuthLevelToString = function(type) {
    if(type == null)
        return -1;

    switch(type) {
        case 1:
            return "Administrator";
        case 2:
            return "Entrepreneur";
        case 3:
            return "Donor";
        default:
            return -1;
    }
}