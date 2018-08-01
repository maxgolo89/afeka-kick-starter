var path                    = require('path');
var logger                  = require(path.join(__basedir, "common/logger/logger"));
var db_interface            = require(path.join(__basedir, "dal/db_interface"));

var TRANSACTIONLOGICERROR = [
    "",
    "Genetic Error",
    "Transaction doesn't exist",
    "Missing Input"
];

var global_db = new db_interface.DB(); // Ugly fix for out of scope issue

class TransactionLogic {
    constructor() {
        this.db = new db_interface.DB();
    }

    /** Add New Transaction.
     * Params: String SourceAccount, String DestinationAccount, Number Sum, callback.
     * Callback(String error, String transactionId) */
    addTransaction(source, destination, sum, cb) {
        if(!source || !destination || !sum)
            cb(TRANSACTIONLOGICERROR[1], null);
        else {
            var newTransaction = {
                source: source,
                destination: destination,
                sum: sum,
                isPending: true,
                isCanceled: false
            };

            this.db.createTransaction(newTransaction, function(err, transaction) {
               if(err)
                   cb(TRANSACTIONLOGICERROR[1], null);
               else {
                   cb(null, transaction._id);
               }
            });
        }
    }

    /** Cancel Transaction.
     * Params: String transactionId, callback.
     * Callback(String error, String transactionId) */
    cancelTransaction(transactionId, cb) {
        if(!transactionId)
            cb(TRANSACTIONLOGICERROR[1], null);
        else {
            this.db.readTransactionById(transactionId, function(err, transaction) {
               if(err)
                   cb(TRANSACTIONLOGICERROR[1], null);
               else {
                   transaction.isCanceled = true;
                   global_db.updateTransaction(transaction, function(i_err, u_transaction) {
                       if(i_err)
                           cb(TRANSACTIONLOGICERROR[1], null);
                       else {
                           cb(null, u_transaction._id);
                       }
                   })
               }
            });
        }
    }

    /** Get Transaction By ID.
     * Params: String transactionId, callback.
     * Callback(String error, Object transaction) */
    getTransactionById(transactionId, cb) {
        if(!transactionId)
            cb(TRANSACTIONLOGICERROR[1], null);
        else {
            this.db.readTransactionById(transactionId, function(err, transaction) {
               if(err)
                   cb(TRANSACTIONLOGICERROR[1], null);
               else {
                   cb(null, transaction);
               }
            });
        }
    }

    /** Perform Transaction.
     * Params: String transactionId, callback.
     * Callback(String error, String transactionId) */
    performTransaction(transactionId, cb) {
        if(!transactionId)
            cb(TRANSACTIONLOGICERROR[1], null);
        else {
            this.db.readTransactionById(transactionId, function(err, transaction) {
                if(err)
                    cb(TRANSACTIONLOGICERROR[1], null);
                else {
                    transaction.isPending = false;
                    global_db.updateTransaction(transaction, function(i_err, u_transaction) {
                        if(i_err)
                            cb(TRANSACTIONLOGICERROR[1], null);
                        else {
                            cb(null, u_transaction._id);
                        }
                    });
                }
            });
        }
    }

}

module.exports = {
    ERR: TRANSACTIONLOGICERROR,
    TL: TransactionLogic
}