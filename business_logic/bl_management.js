var path                    = require('path');
var logger                  = require(path.join(__basedir, "common/logger/logger"));
var project_m               = require(path.join(__basedir, "business_logic/project_management/project_logic"));
var donation_m              = require(path.join(__basedir, "business_logic/donation_management/donation_logic"));
var transaction_m           = require(path.join(__basedir, "business_logic/transaction_management/transaction_logic"));
var user_m                  = require(path.join(__basedir, "business_logic/user_management/user_logic"));
var user_utils              = require(path.join(__basedir, "business_logic/user_management/user_logic_utils"));

var TAG = "BLInterface";

BLERROR = [
    "",
    "Generic Error"
];

/* ***************************************************************************************************
*
* This module should be used to get a handle on all business logic components.
* Also, it contains encapsulations and abstractions for some business logic combined functionalities.
*
* *************************************************************************************************** */


var pl = new project_m.PL();
var ul = new user_m.UL();
var tl = new transaction_m.TL();
var dl = new donation_m.DL();



setInterval(function() {
    pl.getAllProjects(function(err, projects) {
       if(!err) {
            projects.forEach(function(project) {
                if(!project.expired && project.targetDate >= Date.now() && project.targetSum <= project.currentSum) {
                    project.expired = true;
                    dl.getDonationByProject(project._id, function(d_err, donations) {
                       if(!d_err) {
                           donations.forEach(function(donation) {
                               tl.performTransaction(donation.transaction, function (err, id) {
                                   // Nothing to do
                               });
                           });
                       }
                    });
                } else if(!project.expired && project.targetDate >= Date.now() && project.targetSum > project.currentSum) {
                    project.expired = true;
                    dl.getDonationByProject(project._id, function(d_err, donations) {
                        if(!d_err) {
                            donations.forEach(function(donation) {
                                tl.cancelTransaction(donation.transaction, function (err, id) {
                                    // Nothing to do
                                });
                            });
                        }
                    });
                }

            });
       }
    });
}, 60000);


// ====================================================
//  Getters
//  * Retrieve a handle on the business logic classes.
// ====================================================

/** Get Project Logic Instance.
 * No Callback func.
 * Return: ProjectLogic */
module.exports.getProjectLogicInterface = function() {
    return pl;
};

/** Get Donation Logic Instance.
 * No Callback func.
 * Return: DonationLogic */
module.exports.getDonationLogicInterface = function() {
    return dl;
};

/** Get Transaction Logic Instance.
 * No Callback func.
 * Return: TransactionLogic */
module.exports.getTransactionLogicInterface = function() {
    return tl;
};

/** Get User Logic Instance.
 * No Callback func.
 * Return: UserLogic */
module.exports.getUserLogicInterface = function() {
    return ul;
};


// ====================================================
//  Abstractions
// ====================================================

/** Add new donation procedure.
 * 1. Validate user is a donor.
 * 2. Fetch Project
 * 3. Create Transaction.
 * 4. Create Donation. */
module.exports.addDonation = function(projectId, donorUsername, source, destination, sum, cb) {
    if(!projectId || !donorUsername || !source || !destination || !sum || sum <= 0) {
        cb(BLERROR[1], null);
    }
    else {
        ul.getUserByUsername(donorUsername, function(err, user) {
            if(err)
                cb(BLERROR[1], null);
            else {
                if(ul.isDonor(ul.resolveUserAuthLvl(user))){
                    tl.addTransaction(source, destination, sum, function(iii_err, transactionId) {
                        if(iii_err)
                            cb(BLERROR[1], null);
                        else {
                            dl.addDonation(user._id, projectId, transactionId, function(iiii_err, donationId) {
                                if(iiii_err) {
                                    cb(BLERROR[1], null);
                                }
                                else {
                                    pl.addDonation(projectId, sum, function(iiiii_err, pId) {
                                        if(iiiii_err)
                                            cb(BLERROR[1], null);
                                        else {
                                            cb(null, donationId);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
};

/** Cancel Project Logic.
 * 1. Cancel all pending transactions for the project.
 * 2. Cancel project.
 * Params: String projectId, callback.
 * Callback(String error, String projectId) */
module.exports.cancelProject = function(projectId, cb) {
    pl.getProjectById(projectId, function(p_err, project) {
        if(p_err) {
            cb(BLERROR[1], null);
        } else {
            dl.getDonationByProject(projectId, function(d_err, donations) {
                if(d_err) {
                    cb(BLERROR[1], null);
                } else {

                    // Cancel all transactions
                    donations.forEach(function(donation) {
                        tl.cancelTransaction(donation.transaction._id, function(t_err, transaction) {
                            // Nothing to do here.
                        });
                    });

                    // Delete project
                    pl.cancelProject(projectId, function(ip_err, idStr) {
                        if(ip_err)
                            cb(BLERROR[1], null);
                        else {
                            cb(null, idStr);
                        }
                    });
                }
            });
        }
    });
};

/** Add new project.
 * Params: String name, String description, String[] images, String video, Number targetSum, Date targetDate, String projectOwnerUsername, Number bankAccount, callback.
 * Callback(error, projectId) */
module.exports.addProject = function(name, description, images, video, targetSum, targetDate, ownerUsername, bankAccount, cb) {
    ul.getUserByUsername(ownerUsername, function(err, user) {
       if(err || !user_utils.isEntrepreneur(user_utils.resolveUserAuthLvl(user))) {
           console.log(err);
           cb(BLERROR[1], null);
       }
       else {
           new project_m.PL().addProject(name, description, images, video, targetSum, targetDate, user._id, bankAccount, function(i_err, projId) {
                if(i_err) {
                    console.log(i_err);
                    cb(BLERROR[1], null);
                }
                else {
                    cb(null, projId);
                }
           });
       }
    });
};


module.exports.ERR = BLERROR;