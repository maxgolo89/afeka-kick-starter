var path                    = require('path');
var logger                  = require(path.join(__basedir, "common/logger/logger"));
var db_interface            = require(path.join(__basedir, "dal/db_interface"));
var user_logic_utils        = require("./user_logic_utils");

var TAG = "USER LOGIC";
var USERLOGICERROR = [
    "",
    "Genetic Error",
    "User doesn't exist",
    "Username already taken",
    "Missing Input",
    "Wrong Password"
];

// ***************************************************************************
//  User Logic class
// ***************************************************************************

class UserLogic {
    constructor() {
        this.db = new db_interface.DB();
    }

    isAdmin(type) {
        return user_logic_utils.isAdmin(type);
    }

    isDonor(type) {
        return user_logic_utils.isDonor(type);
    }

    isEntrepreneur(type) {
        return user_logic_utils.isEntrepreneur(type);
    }

    /** Resolve string user type to number
     * 1     - Administrator
     * 2     - Entrepreneur
     * 3     - Donor
     * -1    - UnAuthenticated */
    resolveUserAuthLvl(user) {
        return user_logic_utils.resolveUserAuthLvl(user);
    }


    /** Authentication function.
    * Auth levels passed to callback.
    * 1     - Administrator
    * 2     - Entrepreneur
    * 3     - Donor
    * -1    - UnAuthenticated
    * Callback(error, user_id, username, auth_level)*/
    authenticate(username, password, cb) {
        this.db.readUserByUsername(username, function(err, user) {
            if(err) {
                err == db_interface.ERR[1] ? cb(USERLOGICERROR[1], null, null, null) : cb(USERLOGICERROR[2], null, null -1);
            } else if(user && user.password && user.password == password) {
                cb(null, user._id, user_logic_utils.resolveUserAuthLvl(user));
            } else {
                cb(USERLOGICERROR[5], null, -1);
            }
        });
    }

    /** Create new account
    * Callback(error, user_id, username, auth_level)*/
    createAccount(username, password, type, cb) {
        if(!username || !password || !type)
            cb(USERLOGICERROR[1], null, null, null);
        else {
            var newUser = {
                username: username,
                password: password,
                type: user_logic_utils.resolveUserAuthLevelToString(parseInt(type)),
                isActive: true
            };
            this.db.createUser(newUser, function(err, user) {
                if(err == null) {
                    cb(null, user._id, user.username, user_logic_utils.resolveUserAuthLvl(user));
                } else {
                    switch(err) {
                        case db_interface.ERR[1]:
                            cb(USERLOGICERROR[1], null, null, null);
                            break;
                        case db_interface.ERR[2]:
                            cb(USERLOGICERROR[3], null, null, null);
                            break;
                        default:
                            cb(USERLOGICERROR[1], null, null, null);
                    }
                }
            });
        }
    }

    /** Change password.
     * Callback(err, id) */
    changePassword(username, oldPassword, newPassword, cb) {
        if(!username || !oldPassword || !newPassword)
            cb(USERLOGICERROR[4], null);
        else {
            this.db.readUserByUsername(username, function(err, user) {
                if(err) {
                    cb(err == db_interface.ERR[1] ? USERLOGICERROR[1] : USERLOGICERROR[2], null);
                } else if(user.password == oldPassword) {
                    user.password = newPassword;
                    this.db.updateUser(user, function(err, user) {
                       if(err) {
                           cb(USERLOGICERROR[1], null);
                       } else {
                           cb(null, user._id);
                       }
                    });
                }
            });
        }
    }

    deactivateUser(username, cb) {
        if(!username)
            cb(USERLOGICERROR[4], null);
        else {
            this.db.readUserByUsername(username, function(err, user) {
                if(err) {
                    cb(err == db_interface.ERR[1] ? USERLOGICERROR[1] : USERLOGICERROR[2], null);
                } else {
                    user.isActive = false;
                    this.db.updateUser(user, function(err, user) {
                        if(err) {
                            cb(USERLOGICERROR[1], null);
                        } else {
                            cb(null, user._id);
                        }
                    });
                }
            });
        }
    }

    activateUser(username, cb) {
        if(!username)
            cb(USERLOGICERROR[4], null);
        else {
            this.db.readUserByUsername(username, function(err, user) {
                if(err) {
                    cb(err == db_interface.ERR[1] ? USERLOGICERROR[1] : USERLOGICERROR[2], null);
                } else {
                    user.isActive = true;
                    this.db.updateUser(user, function(err, user) {
                        if(err) {
                            cb(USERLOGICERROR[1], null);
                        } else {
                            cb(null, user._id);
                        }
                    });
                }
            });
        }
    }

    getUserByUsername(username, cb) {
        if(!username)
            cb(USERLOGICERROR[1], null);
        else {
            this.db.readUserByUsername(username, function(err, user) {
               if(err)
                   cb(USERLOGICERROR[4], null);
               else {
                   user.password = "";
                   cb(null, user);
               }
            });
        }
    }

    /* Callback(error, userId, userType */
    getUserByProject(projectId, cb) {
        if(!projectId)
            cb(USERLOGICERROR[4], null);
        else {
            this.db.readProjectById(projectId, function(err, project) {
                if(err)
                    cb(err == db_interface.ERR[1] ? USERLOGICERROR[1] : USERLOGICERROR[2], null);
                else {
                    this.db.readUserById(project.owner, function(err, user) {
                        if(err)
                            cb(err == db_interface.ERR[1] ? USERLOGICERROR[1] : USERLOGICERROR[2], null);
                        else {
                            cb(null, user._id, user_logic_utils.resolveUserAuthLvl(user.type));
                        }
                    });
                }
            });
        }
    }


    getUserByDonation(donationId, cb) {
        if(!donationId)
            cb(USERLOGICERROR[4], null);
        else {
            this.db.readDonationById(donationId, function(err, donation) {
                if(err)
                    cb(err == db_interface.ERR[1] ? USERLOGICERROR[1] : USERLOGICERROR[2], null);
                else {
                    this.db.readUserById(donation.donor, function(err, user) {
                        if(err)
                            cb(err == db_interface.ERR[1] ? USERLOGICERROR[1] : USERLOGICERROR[2], null);
                        else {
                            cb(null, user._id, user_logic_utils.resolveUserAuthLvl(user.type));
                        }
                    });
                }
            });
        }
    }

    /* callback(error, users) */
    getUsers(cb) {
        this.db.readUsers(function(err, users) {
            if(err) {
                cb(USERLOGICERROR[1], null);
            } else {
                var userInfoList = [];
                users.forEach(function(user) {
                   userInfoList.push({
                       id: user._id,
                       username: user.username,
                       type: user_logic_utils.resolveUserAuthLvl(user)
                   });
                });
                cb(null, userInfoList);
            }
        });
    }


}


module.exports = {
    ERR: USERLOGICERROR,
    UL: UserLogic}