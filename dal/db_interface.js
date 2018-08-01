// Imports
var path                    = require('path');
var logger                  = require(path.join(__basedir, "common/logger/logger"));
var mongoose                = require("mongoose");
var User                    = require("./models/user");
var Project                 = require("./models/project");
var Donation                = require("./models/donation");
var Transaction             = require("./models/transaction");

// CONST
const TAG                   = "DBInterface";

// Error definitions
var DBERROR = [
    "",
    "Something went wrong",
    "Entity already exist",
    "Entity was not found"]

class DBInterface {
    constructor() {
        mongoose.connect("mongodb://localhost:27017/afekakickstarter", { useNewUrlParser: true });
        this.con = mongoose.connection;
    }

    // ***************************************************************************
    //  User CRUD
    // ***************************************************************************

    /* === Create === */
    createUser(userObj, callback) {
        /* Validate username doesn't exist */
        this.readUserByUsername(userObj.username, function(err, user) {

            /* Username already exist, user not created, exec callback with error */
            if(user) {
                callback(DBERROR[2], null);

            /* User doesn't exist, create using params */
            } else {
                /* Create new User entity */
                var newUser = new User({
                    username: userObj.username,
                    password: userObj.password,
                    type: userObj.type,
                    isActive: userObj.isActive
                });

                /* Save entity to DB */
                newUser.save(function(err, user) {

                    /* Save failed, log error, exec callback with error */
                    if(err) {
                        logger.err(TAG, err);
                        callback(DBERROR[1], null);
                    }

                    /* Save succeeded, log info, exec callback without error */
                    else {
                        callback(null, user);
                    }
                });
            }
        });
    }

    /* === Read === */
    readUserById(idStr, callback) {
        /* Fetch user from DB by id */
        User.findById(idStr, function(err, user) {

            /* DB query went wrong, exec callback with error */
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            }

            /* Id wasn't found, exec callback with error */
            else if(!user) {
                callback(DBERROR[3], null);

            /* if was found, exec callback without error */
            } else {
                callback(null, user);
           }
        });
    }


    readUserByUsername(usernameStr, callback) {
        /* Fetch user by username */
        User.find({username: usernameStr}, function(err, user) {
            /* Query went wrong */
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            }

            /* Query succeeded, but entry wasn't found */
            else if(!user) {
                callback(DBERROR[3], null);

            /* Query succeeded, entry was found */
            } else {
                callback(null, user[0]);
            }
        });
    }

    readUsersByType(typeStr, callback) {
        /* Fetch */
        User.find({type: typeStr}, function(err, users) {
            /* Error handle */
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            }
            /* Query succeeded, no result */
            else if(!users) {
                callback(DBERROR[3], null);
            }
            /* Query succeeded, with results */
            else {
                callback(null, users);
            }
        });
    }

    readUsers(callback) {
        User.find(function(err, users) {
           if(err) {
               logger.err(TAG, err);
               callback(DBERROR[1], null);
           } else {
               callback(null, users);
           }
        });
    }

    /* === Update === */
    updateUser(userObj, callback) {
        this.readUserById(userObj._id, function(err, user) {
            if(user) {
                user.username = userObj.username;
                user.password = userObj.password;
                user.type = userObj.type;
                user.isActive = userObj.isActive;

                user.save(function(err, updatedUser) {
                    if(err) {
                        logger.err(TAG, err);
                        callback(DBERROR[1], null);
                    }
                    else {
                        callback(null, updatedUser);
                    }
                });
            }
            else {
                callback(DBERROR[1], null)
            }
        })
    }

    /* === Delete === */
    deleteUser(idStr, callback) {
        this.readUserById(idStr, function(err, user) {
           if(user) {
               user.remove();
               callback(null, user);
           } else {
               callback(DBERROR[1], null);
           }
        });
    }

    // ***************************************************************************
    //  Project CRUD
    // ***************************************************************************

    /* === Create === */
    createProject(projectObj, callback) {
        logger.info(TAG, "In createProject");

        var newProject = new Project({
            name: projectObj.name,
            description: projectObj.description,
            images: projectObj.images,
            video: projectObj.video,
            targetSum: projectObj.targetSum,
            currentSum: projectObj.currentSum,
            targetDate: projectObj.targetDate,
            owner: projectObj.owner,
            expired: projectObj.expired,
            bankAccount: projectObj.bankAccount
        });

        logger.info(TAG, newProject);

        newProject.save(function(err, project) {
           if(err) {
               logger.err(TAG, err + "createProject");
               callback(DBERROR[1], null)
           } else {
               callback(null, project);
           }
        });
    }

    /* === Read === */
    readAllProjects(callback) {
        Project.find({}, function(err, projects) {
           if(err) {
               logger.err(TAG, err + "readAllProjects");
               callback(DBERROR[1], null);
           } else {
               callback(null, projects);
           }
        });
    }

    readProjectById(idStr, callback) {
        Project.findById(idStr, function(err, project) {
            if(err) {
                logger.err(TAG, err + "readProjectById");
                callback(DBERROR[1], null)
            } else {
                callback(null, project);
            }
        });
    }

    readProjectsByName(nameStr, callback) {
        Project.find({name: nameStr}, function(err, projects) {
            if(err) {
                logger.err(TAG, err + "readProjectsByName");
                callback(DBERROR[1], null)
            } else {
                callback(null, projects);
            }
        });
    }

    readProjectsByUserId(userIdStr, callback) {
        Project.find({owner: userIdStr}, function(err, projects) {
            if(err) {
                logger.err(TAG, err + "readProjectsByUserId");
                callback(DBERROR[1], null)
            } else {
                callback(null, projects);
            }
        });
    }

    /* === Update === */
    updateProject(projectObj, callback) {
        Project.findById(projectObj._id, function(err, project) {
            if(err) {
                logger.err(TAG, err + "updateProject");
                callback(DBERROR[1], null)
            } else if (project) {
                project.name            = projectObj.name;
                project.description     = projectObj.description;
                project.images          = projectObj.images;
                project.video           = projectObj.video;
                project.targetSum       = projectObj.targetSum;
                project.currentSum      = projectObj.currentSum;
                project.targetDate      = projectObj.targetDate;
                project.owner           = projectObj.owner;
                project.expired         = projectObj.expired;
                project.bankAccount     = projectObj.bankAccount;

                project.save(function(err, updatedProject) {
                   if(err) {
                       logger.err(TAG, err + "updateProject");
                       callback(DBERROR[1], null)
                   } else {
                       callback(null, updatedProject);
                   }
                });
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    /* === Delete === */
    deleteProject(idStr, callback) {
        Project.findById(idStr, function(err, project) {
           if(err) {
               logger.err(TAG, err);
               callback(DBERROR[1], null);
           } else if (project) {
               project.remove();
               callback(null, project);
           } else {
               callback(DBERROR[3], null);
           }
        });
    }

    // ***************************************************************************
    //  Donation CRUD
    // ***************************************************************************

    /* === Create === */
    createDonation(donationObj, callback) {
        var newDonation = new Donation({
            donor: donationObj.donor,
            project: donationObj.project,
            transaction: donationObj.transaction,
            timeStamp: donationObj.timeStamp
        });

        newDonation.save(function(err, donation) {
           if(err) {
               logger(TAG, err);
               callback(DBERROR[1], null);
           } else if(donation) {
               callback(null, donation);
           } else {
               callback(DBERROR[1], null);
           }
        });
    }

    /* === Read === */
    readDonationById(idStr, callback) {
        Donation.findById(idStr, function(err, donation) {
           if(err) {
               logger.err(TAG, err);
               callback(DBERROR[1], null);
           } else if(donation) {
               callback(null, donation);
           } else {
               callback(DBERROR[3], null);
           }
        });
    }

    readDonationsByUserId(userIdStr, callback) {
        Donation.find({donor: userIdStr}, function(err, donation) {
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            } else if(donation) {
                callback(null, donation);
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    readDonationsByProjectId(projectIdStr, callback) {
        Donation.find({project: projectIdStr}, function(err, donation) {
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            } else if(donation) {
                callback(null, donation);
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    readDonationByTransactionId(transactionIdStr, callback) {
        Donation.find({transaction: transactionIdStr}, function(err, donation) {
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            } else if(donation) {
                callback(null, donation);
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    /* === Update === */
    updateDonation(donationObj, callback) {
        Donation.findById(donationObj._id, function(err, donation) {
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            } else if(donation) {
                donation.donor          = donationObj.donor;
                donation.project        = donationObj.project;
                donation.transaction    = donationObj.transaction;
                donation.timeStamp      = donationObj.timeStamp;
                donation.save(function(err, updatedDonation) {
                    if(err) {
                        logger.err(TAG, err);
                        callback(DBERROR[1], null);
                    } else if(updatedDonation) {
                        callback(null, updatedDonation);
                    } else {
                        callback(DBERROR[1], null);
                    }
                });
                callback(null, donation);
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    /* === Delete === */
    deleteDonation(idStr, callback) {
        Donation.findById(idStr, function(err, donation) {
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            } else if(donation) {
                callback.remove();
                callback(null, donation);
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    // ***************************************************************************
    //  Transaction CRUD
    // ***************************************************************************

    /* === Create === */
    createTransaction(transactionObj, callback) {
        var newTransaction = new Transaction({
            source: transactionObj.source,
            destination: transactionObj.destination,
            sum: transactionObj.sum,
            isPending: transactionObj.isPending,
            isCanceled: transactionObj.isCanceled
        });

        newTransaction.save(function(err, transaction) {
           if(err) {
               logger.err(TAG, err);
               callback(DBERROR[1], null);
           } else if(transaction) {
               callback(null, transaction);
           } else {
               callback(DBERROR[1], null);
           }
        });
    }

    /* === Read === */
    readTransactionById(idStr, callback) {
        Transaction.findById(idStr, function(err, transaction) {
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            } else if(transaction) {
                callback(null, transaction);
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    readTransactionsBySource(sourceStr, callback) {
        Transaction.find({source: sourceStr}, function(err, transactions) {
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            } else if(transactions) {
                callback(null, transactions);
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    readTransactionsByDestination(destinationStr, callback) {
        Transaction.find({destination: destinationStr}, function(err, transactions) {
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            } else if(transactions) {
                callback(null, transactions);
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    readTransactionsBySum(sumNumber, callback) {
        Transaction.find({sum: sumNumber}, function(err, transactions) {
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            } else if(transactions) {
                callback(null, transactions);
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    readTransactionsByPandingStatus(pandingBool, callback) {
        Transaction.find({isPending: pandingBool}, function(err, transactions) {
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            } else if(transactions) {
                callback(null, transactions);
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    readTransactionsByCancelStatus(cancelBool, callback) {
        Transaction.find({isCanceled: cancelBool}, function(err, transactions) {
            if(err) {
                logger.err(TAG, err);
                callback(DBERROR[1], null);
            } else if(transactions) {
                callback(null, transactions);
            } else {
                callback(DBERROR[3], null);
            }
        });
    }

    /* === Update === */
    updateTransaction(transactionObj, callback) {
        Transaction.findById(transactionObj._id, function(err, transaction) {
           if(err) {
               logger.err(TAG, err);
               callback(DBERROR[1], null);
           } else if(transaction) {
               transaction.source       = transactionObj.source;
               transaction.destination  = transactionObj.destination;
               transaction.sum          = transactionObj.sum;
               transaction.isPending    = transactionObj.isPending;
               transaction.isCanceled   = transactionObj.isCanceled;

               transaction.save(function(err, updatedTransaction) {
                  if(err) {
                      logger.err(TAG, err);
                      callback(DBERROR[1], null);
                  } else if(updatedTransaction) {
                      callback(null, updatedTransaction);
                  } else {
                      callback(DBERROR[1], null);
                  }
               });
           } else {
               callback(DBERROR[3], null);
           }
        });
    }

    /* === Delete === */
    deleteTransaction(idStr, callback) {
        Transaction.findById(idStr, function(err, transaction) {
           if(err) {
               logger.err(TAG, err);
               callback(DBERROR[1], null);
           } else if(transaction) {
               transaction.remove();
               callback(null, transaction);
           } else {
               callback(DBERROR[3], null);
           }
        });
    }
}

module.exports = {
    ERR: DBERROR,
    DB: DBInterface};