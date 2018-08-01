var path                    = require('path');
var logger                  = require(path.join(__basedir, "common/logger/logger"));
var db_interface            = require(path.join(__basedir, "dal/db_interface"));

var DONATIONLOGICERROR = [
    "",
    "Genetic Error",
    "Donation doesn't exist",
    "Missing Input"
];

class DonationLogic {
    constructor() {
        this.db = new db_interface.DB();
    }

    /** Add Donation.
     * Params: String donorId, String projectId, String transactionId, callback.
     * Callback(String error, String donationId) */
    addDonation(donorId, projectId, transactionId, cb) {
        if(!donorId || !projectId || !transactionId) {
            cb(DONATIONLOGICERROR[1], null);
            console.log(donorId);
            console.log(projectId);
            console.log(transactionId);
        }

        else {
            var newDonation = {
                donor: donorId,
                project: projectId,
                transaction: transactionId,
                timeStamp: Date.now()
            };

            this.db.createDonation(newDonation, function(err, donation) {
               if(err) {
                   cb(DONATIONLOGICERROR[1], null);
                   console.log("2");
               }

                else {
                   cb(null, donation._id);
               }
            });
        }
    }

    /** Get Donation By ID.
     * Params: String donationId, callback.
     * Callback(String error, Object donation) */
    getDonationById(donationId, cb) {
        if(!donationId)
            cb(DONATIONLOGICERROR[1], null);
        else {
            this.db.readDonationById(donationId, function(err, donation) {
                if(err) {
                    cb(DONATIONLOGICERROR[1], null);
                } else {
                    cb(null, donation);
                }
            });
        }
    }

    /** Get Donations By Project.
     * Params: String projectId, callback.
     * Callback(String error, Object[] donations) */
    getDonationByProject(projectId, cb) {
        if(!projectId)
            cb(DONATIONLOGICERROR[1], null);
        else {
            this.db.readDonationsByProjectId(projectId, function(err, donation) {
                if(err) {
                    cb(DONATIONLOGICERROR[1], null);
                } else {
                    cb(null, donation);
                }
            });
        }
    }

    /** Get Donations By Donor.
     * Params: String donorId, callback.
     * Callback(String error, Object[] donations) */
    getDonationByDonor(donorId, cb) {
        if(!donorId)
            cb(DONATIONLOGICERROR[1], null);
        else {
            this.db.readDonationsByUserId(donorId, function(err, donation) {
                if(err) {
                    cb(DONATIONLOGICERROR[1], null);
                } else {
                    cb(null, donation);
                }
            });
        }
    }

    /** Get Donation Sum.
     * Params: String donationId, callback.
     * Callback(String error, Number sum) */
    getDonationSum(donationId, cb) {
        if(!donationId)
            cb(DONATIONLOGICERROR[1], null);
        else {
            this.db.readDonationById(donationId, function(err, donation) {
                if(err) {
                    cb(DONATIONLOGICERROR[1], null);
                } else {
                    this.db.readTransactionById(donation.transaction, function(err, transaction) {
                       if(err)
                           cb(DONATIONLOGICERROR[1], null);
                       else {
                           cb(null, transaction.sum);
                       }
                    });
                }
            });
        }
    }

    /** Get Donation Status (Is Pending).
     * Params: String donationId, callback.
     * Callback(String error, Boolean isPending, Boolean isCanceled) */
    isPending(donationId, cb) {
        if(!donationId)
            cb(DONATIONLOGICERROR[1], null);
        else {
            this.db.readDonationById(donationId, function(err, donation) {
                if(err) {
                    cb(DONATIONLOGICERROR[1], null);
                } else {
                    this.db.readTransactionById(donation.transaction, function(err, transaction) {
                        if(err)
                            cb(DONATIONLOGICERROR[1], null);
                        else {
                            cb(null, transaction.isPending, transaction.isCanceled);
                        }
                    });
                }
            });
        }
    }
}

module.exports = {
    ERR: DONATIONLOGICERROR,
    DL: DonationLogic
}