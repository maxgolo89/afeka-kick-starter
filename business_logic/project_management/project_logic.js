var path                    = require('path');
var logger                  = require(path.join(__basedir, "common/logger/logger"));
var db_interface            = require(path.join(__basedir, "dal/db_interface"));
var project_logic_utils     = require("./project_logic_utils");

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
               cb(null, projects);
           }
        });
    }

    /** Get All Active Projects.
     * Params: callback.
     * Callback(String error, object[] projects) */
    getAllActiveProjects(cb) {
        this.db.readAllProjects(function(err, projects) {
            if(err) {
                logger.err(TAG, err);
                cb(PROJECTLOGICERROR[1], null);
            } else {
                var activeProjects = [];
                projects.forEach(function(project) {
                    if(!project_logic_utils.isExpired(project.targetSum, project.currentSum, project.targetDate)) {
                        activeProjects.push(project);
                    }
                });
                cb(null, activeProjects);
            }
        });
    }

    /** Get All Kicked Out Projects.
     * Params: callback.
     * Callback(String error, object[] projects) */
    getAllKickedOutProject(cb) {
        this.db.readAllProjects(function(err, projects) {
            if(err) {
                logger.err(TAG, err);
                cb(PROJECTLOGICERROR[1], null);
            } else {
                var kickedOutProjects = [];
                projects.forEach(function(project) {
                   if(project_logic_utils.isKickedOut(project.targetSum, project.currentSum, project.targetDate)) {
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
                logger.err(TAG, err);
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
        if(!projectId) {
            logger.err(TAG, "argument error");
            cb(PROJECTLOGICERROR[1], null);
        } else {
            this.db.readProjectById(projectId, function(err, project) {
               if(err) {
                   logger.err(TAG, err);
                   cb(PROJECTLOGICERROR[1], null);
               } else {
                   cb(null, project);
               }
            });
        }
    }

    /** Get Projects By Owner.
     * Params: String userId, callback.
     * Callback(String error, Object[] projects) */
    getProjectsByOwner(userId, cb) {
        if(!userId) {
            logger.err(TAG, "argument error");
            cb(PROJECTLOGICERROR[1], null);
        } else {
            this.db.readProjectsByUserId(userId, function(err, projects) {
                if(err) {
                    cb(PROJECTLOGICERROR[1], null);
                    logger.err(TAG, err);
                } else {
                    cb(null, projects);
                }
            });
        }
    }

    /** Add donation funds to project.
     * Params: String id, Number sum, callback
     * Callback(String error, String projectId */
    addDonation(projectId, sum, cb) {
        if(!projectId || !sum || sum <= 0) {
            logger.err(TAG, "argument error");
            cb(PROJECTLOGICERROR[1], null);
        } else {
            this.db.readProjectById(projectId, function(err, project) {
                if(err) {
                    logger.err(TAG, err);
                    cb(PROJECTLOGICERROR[1], null);
                } else {
                    project.currentSum = parseInt(project.currentSum) + parseInt(sum);
                    global_db.updateProject(project, function(i_err, i_project) {
                        if(i_err) {
                            logger.err(TAG, err);
                            cb(PROJECTLOGICERROR[1], null);
                        } else {
                            cb(null, i_project._id);
                        }
                    });
                }
            });
        }
    }

    updateProject(id, name, description, images, video, targetSum, targetDate, bankAccount, cb) {
        this.db.readProjectById(id, function (err, project) {
            if (err) {
            } else {
                project.name        = project.name          == name         ? project.name          : name;
                project.description = project.description   == description  ? project.description   : description;
                project.images[0]   = project.images[0]     == images[0]    ? project.images[0]     : images[0];
                project.images[1]   = project.images[1]     == images[1]    ? project.images[1]     : images[1];
                project.images[2]   = project.images[2]     == images[2]    ? project.images[2]     : images[2];
                project.video       = project.video         == video        ? project.video         : video;
                project.targetSum   = project.targetSum;
                project.targetDate  = project.targetDate;
                project.bankAccount = project.bankAccount   == bankAccount  ? project.bankAccount   : bankAccount;
                global_db.updateProject(project, function(err, updatedProject) {
                    if(err) {

                    } else {
                        cb(null, updatedProject);
                    }
                });
            }
        });
    }




}

module.exports = {
    ERR: PROJECTLOGICERROR,
    PL: ProjectLogic
}