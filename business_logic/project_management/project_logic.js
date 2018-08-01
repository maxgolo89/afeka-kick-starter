var path                    = require('path');
var logger                  = require(path.join(__basedir, "common/logger/logger"));
var db_interface            = require(path.join(__basedir, "dal/db_interface"));

var TAG = "ProjectLogic"

var PROJECTLOGICERROR = [
    "",
    "Genetic Error",
    "Project doesn't exist",
    "Project name already taken",
    "Missing Input"
];

var global_db = new db_interface.DB(); // Ugly fix for out of scope issue

class ProjectLogic {
    constructor() {
        this.db = new db_interface.DB();

    }

    /** Add new project.
     * Params: String name, String Description, String[] images (URL's), String video (URL's), Number targetSum, Date targetDate, callback.
     * Callback(String error, String projectId) */
    addProject(name, description, images, video, targetSum, targetDate, ownerId, bankAccount, cb) {
        if(!name || !description || !targetSum || !targetDate || !ownerId || !bankAccount) {
            cb(PROJECTLOGICERROR[1], null);
        }

        else {
            var newProject = {
                name: name,
                description: description,
                images: images,
                video: video,
                targetSum: targetSum,
                currentSum: 0,
                targetDate: targetDate,
                owner: ownerId,
                expired: false,
                bankAccount: bankAccount
            };

            this.db.createProject(newProject, function(err, project) {
               if(err) {
                   logger.err(TAG, err);
                   cb(PROJECTLOGICERROR[1], null);
               }
               else {
                   logger.info(TAG, project);
                   cb(null, project._id);
               }
            });
        }
    }

    /** Cancel Project.
     * Params: String projectId, callback.
     * Callback(String error, String projectId) */
    cancelProject(projectId, cb) {
        if(!projectId)
            cb(PROJECTLOGICERROR[1], null);
        else {
            this.db.deleteProject(projectId, function(err, project) {
                if(err)
                    cb(PROJECTLOGICERROR[1], null);
                else {
                    cb(null, project._id);
                }
            });
        }
    }

    /** Get All Projects.
     * Params: callback.
     * Callback(String error, object[] projects) */
    getAllProjects(cb) {
        this.db.readAllProjects(function(err, projects) {
           if(err) {
               logger.err(TAG, err);
               cb(PROJECTLOGICERROR[1], null);
           } else {
               logger.info(TAG, projects.length);
               cb(null, projects);
           }
        });
    }

    /** Get All Kicked Out Projects.
     * Params: callback.
     * Callback(String error, object[] projects) */
    getAllKickedOutProject(cb) {
        this.db.readProjectsByName("", function(err, projects) {
            if(err) {
                cb(PROJECTLOGICERROR[1], null);
            } else {
                var kickedOutProjects = [];
                projects.forEach(function(project) {
                   if(project.currentSum >= project.targetSum && project.targetDate >= Date.now()) {
                       kickedOutProjects.push(project);
                   }
                });
                cb(null, kickedOutProjects);
            }
        });
    }

    /** Get All Active Kicked Out Projects.
     * Params: callback.
     * Callback(String error, object[] projects) */
    getAllActiveKickedOutProjects(cb) {
        this.db.readProjectsByName("", function(err, projects) {
            if(err) {
                cb(PROJECTLOGICERROR[1], null);
            } else {
                var activeKickedOutProjects = [];
                projects.forEach(function(project) {
                    if(project.currentSum >= project.targetSum && project.targetDate < Date.now()) {
                        activeKickedOutProjects.append(project);
                    }
                });
                cb(null, activeKickedOutProjects);
            }
        });
    }

    /** Get Project By ID.
     * Params: String projectId, callback.
     * Callback(String error, Object project) */
    getProjectById(projectId, cb) {
        if(!projectId)
            cb(PROJECTLOGICERROR[1], null);
        else {
            this.db.readProjectById(projectId, function(err, project) {
               if(err)
                   cb(PROJECTLOGICERROR[1], null);
               else {
                   cb(null, project);
               }
            });
        }
    }

    /** Get Projects By Owner.
     * Params: String userId, callback.
     * Callback(String error, Object[] projects) */
    getProjectsByOwner(userId, cb) {
        if(!userId)
            cb(PROJECTLOGICERROR[1], null);
        else {
            this.db.getProjectsByOwner(userId, function(err, projects) {
                if(err)
                    cb(PROJECTLOGICERROR[1], null);
                else {
                    cb(null, projects);
                }
            });
        }
    }

    /** Check project status (Is Kicked Out)
     * Params: Number targetSum, Number currentSum, Date targetDate, callback.
     * Callback(String error, Boolean isKickedOut) */
    isKickedOut(targetSum, currentSum, targetDate, cb) {
        if(!targetSum || !currentSum || !targetDate)
            cb(PROJECTLOGICERROR[1], null);
        else if(targetSum <= currentSum && targetDate <= Date.now()) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }

    /** Check Project Status (Is Expired)
     * Params: Number targetSum, Number currentSum, Date targetDate, callback.
     * Callback(String error, Boolean isExpired) */
    isExpired(targetSum, currentSum, targetDate, cb) {
        if(!targetSum || !currentSum || !targetDate)
            cb(PROJECTLOGICERROR[1], null);
        else if(targetSum > currentSum && targetDate <= Date.now()) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }

    /** Check Project Status (Is Goal Reached and Still Active)
     * Params: Number targetSum, Number currentSum, Date targetDate, callback.
     * Callback(String error, Boolean isGoalReachedAndActive) */
    isGoalReached(targetSum, currentSum, targetDate, cb) {
        if(!targetSum || !currentSum || !targetDate)
            cb(PROJECTLOGICERROR[1], null);
        else if(targetSum <= currentSum && targetDate > Date.now()) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }

    /** Add donation funds to project.
     * Params: String id, Number sum, callback
     * Callback(String error, String projectId */
    addDonation(projectId, sum, cb) {
        if(!projectId || !sum || sum <= 0)
            cb(PROJECTLOGICERROR[1], null);
        else {
            this.db.readProjectById(projectId, function(err, project) {
                if(err)
                    cb(PROJECTLOGICERROR[1], null);
                else {
                    project.currentSum += sum;
                    global_db.updateProject(project, function(i_err, i_project) {
                        if(i_err)
                            cb(PROJECTLOGICERROR[1], null);
                        else {
                            cb(null, i_project._id);
                        }
                    });
                }
            });
        }
    }
}

module.exports = {
    ERR: PROJECTLOGICERROR,
    PL: ProjectLogic
}