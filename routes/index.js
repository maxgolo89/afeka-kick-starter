var path                    = require('path');
var express                 = require('express');
var ejs                     = require("ejs");
var router                  = express.Router();
var bl                      = require(path.join(__basedir, "business_logic/bl_management"));
var logger                  = require(path.join(__basedir, "common/logger/logger"));

var TAG = "ROUTER";

var bl_inst = bl;

function responseDispatcher(req, res, template, err, msg, params) {
    ejs.renderFile(path.join(__basedir, template), {err: err ,msg: msg, params: params}, function(err, body) {
        if(err) {
            logger.err(TAG, "Failed to render: " + template);
            logger.err(TAG, err);
        } else {
            logger.info(TAG , "Delivering: " + template);
            var response = {
                err: null,
                auth_lvl: req.session.auth_lvl,
                username: req.session.username,
                header: "Afeka KickStarter",
                data: body
            };
            res.send(response);
        }
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/** ******************************************************************************************
 *          PROJECTS ROUTES
 *  *******************************************************************************************/
/* GET home from ajax request */
router.get("/projects", function(req, res) {
  bl_inst.getProjectLogicInterface().getAllActiveProjects(function(err, projects) {
      if(err) {
          logger.err(TAG, err);

          var template  = "views/generic-message.ejs";
          var err       = null;
          var msg       = "Something went wrong";
          var params    = null;

          responseDispatcher(req, res, template, err, msg, params);
      } else {
          var template  = "views/projects.ejs";
          var err       = null;
          var msg       = null;
          var params    = {projects: projects};

          responseDispatcher(req, res, template, err, msg, params);
      }
  });
});

/* GET home from ajax request */
router.get("/projects/my", function(req, res) {
    if(!bl_inst.getUserLogicInterface().isEntrepreneur(req.session.auth_lvl)) {
        logger.err(TAG, "Unauthorized attempt to GET my projects");

        var template  = "views/generic-message.ejs";
        var err       = null;
        var msg       = "Unauthorized";
        var params    = null;

        responseDispatcher(req, res, template, err, msg, params);
    } else {
        bl_inst.getUserLogicInterface().getUserByUsername(req.session.username, function(err, user) {
            if(err) {
                logger.err(TAG, err);

                var template  = "views/generic-message.ejs";
                var err       = null;
                var msg       = "Something went wrong";
                var params    = null;

                responseDispatcher(req, res, template, err, msg, params);
            } else {
                bl_inst.getProjectLogicInterface().getProjectsByOwner(user._id, function(err, projects) {
                    if(err) {
                        logger.err(TAG, err);

                        var template  = "views/generic-message.ejs";
                        var err       = null;
                        var msg       = "Something went wrong";
                        var params    = null;

                        responseDispatcher(req, res, template, err, msg, params);
                    } else {
                        var template  = "views/projects.ejs";
                        var err       = null;
                        var msg       = null;
                        var params    = {projects: projects};

                        responseDispatcher(req, res, template, err, msg, params);
                    }
                });
            }
        });
    }
});


/* GET register project */
router.get("/projects/create", function(req, res) {
    if(!bl_inst.getUserLogicInterface().isEntrepreneur(req.session.auth_lvl)) {
        logger.err(TAG, "Unauthorized attempt to GET project registration form");

        var template  = "views/generic-message.ejs";
        var err       = null;
        var msg       = "Unauthorized";
        var params    = null;

        responseDispatcher(req, res, template, err, msg, params);
    } else {
        var template  = "views/project-create-form.ejs";
        var err       = null;
        var msg       = null;
        var params    = null;

        responseDispatcher(req, res, template, err, msg, params);
    }
});

/* GET kicked out project */
router.get("/projects/kickedout", function(req, res) {
    bl_inst.getProjectLogicInterface().getAllKickedOutProject(function(err, projects) {
        if(err) {
            logger.err(TAG, err);

            var template  = "views/generic-message.ejs";
            var err       = null;
            var msg       = "Something went wrong";
            var params    = null;

            responseDispatcher(req, res, template, err, msg, params);
        } else {
            var template  = "views/projects.ejs";
            var err       = null;
            var msg       = null;
            var params    = {projects: projects};

            responseDispatcher(req, res, template, err, msg, params);
        }
    });
});

/* GET register project */
router.get("/projects/create", function(req, res) {
    if(!bl_inst.isEntrepreneur(req.session.auth_lvl)) {
        logger.err(TAG, "Unauthorized attempt to GET project registration form");

        var template  = "views/generic-message.ejs";
        var err       = null;
        var msg       = "Unauthorized";
        var params    = null;

        responseDispatcher(req, res, template, err, msg, params);
    } else {
        var template  = "views/project-create-form.ejs";
        var err       = null;
        var msg       = null;
        var params    = null;

        responseDispatcher(req, res, template, err, msg, params);
    }
});

/* GET project */
router.get("/projects/:id", function(req, res,) {
  bl_inst.getProjectLogicInterface().getProjectById(req.params.id, function(err, project) {
      if(err) {
          logger.err(TAG, err);

          var template  = "views/generic-message.ejs";
          var err       = null;
          var msg       = "Something went wrong";
          var params    = null;

          responseDispatcher(req, res, template, err, msg, params);
      } else {
          var template  = "views/project.ejs";
          var err       = null;
          var msg       = null;
          var params    = {project: project, auth_lvl: req.session.auth_lvl, uid: req.session.uid};

          responseDispatcher(req, res, template, err, msg, params);
      }
  });
});

/* GET donate project */
router.get("/projects/:id/donate", function(req, res) {
    if(!bl_inst.getUserLogicInterface().isDonor(req.session.auth_lvl)) {
        logger.err(TAG, "Unauthorized attempt to GET project registration form");

        var template  = "views/generic-message.ejs";
        var err       = null;
        var msg       = "Unauthorized";
        var params    = null;

        responseDispatcher(req, res, template, err, msg, params);
    } else {
        var template  = "views/donation-form.ejs";
        var err       = null;
        var msg       = null;
        var params    = {projectId: req.params.id};

        responseDispatcher(req, res, template, err, msg, params);
    }
});

/* GET edit project form */
router.get("/projects/:id/edit", function(req, res) {
    if(!bl_inst.getUserLogicInterface().isEntrepreneur(req.session.auth_lvl)) {
        logger.err(TAG, "Unauthorized attempt to GET project registration form");

        var template  = "views/generic-message.ejs";
        var err       = null;
        var msg       = "Unauthorized";
        var params    = null;

        responseDispatcher(req, res, template, err, msg, params);
    } else {
        bl_inst.getProjectLogicInterface().getProjectById(req.params.id, function(err, project) {
            if(err) {
                logger.err(TAG, err);

                var template  = "views/generic-message.ejs";
                var err       = null;
                var msg       = "Something went wrong";
                var params    = null;
            } else {
                var template  = "views/project-edit-form.ejs";
                var err       = null;
                var msg       = null;
                var params    = {project: project, auth_lvl: req.session.auth_lvl};


            }
            responseDispatcher(req, res, template, err, msg, params);
        });
    }
});

/* POST edit project form */
router.post("/projects/:id/edit", function(req, res) {
    if(!bl_inst.getUserLogicInterface().isEntrepreneur(req.session.auth_lvl)) {
        logger.err(TAG, "Unauthorized attempt to GET project registration form");

        var template  = "views/generic-message.ejs";
        var err       = null;
        var msg       = "Unauthorized";
        var params    = null;

        responseDispatcher(req, res, template, err, msg, params);
    } else {
        bl_inst.getProjectLogicInterface().updateProject(req.body.pid, req.body.name, req.body.description, req.body.images, req.body.video, null, null, req.body.bankAccount, function(err, updatedProject) {
           if(err) {
               logger.err(TAG, err);

               var template  = "views/generic-message.ejs";
               var err       = null;
               var msg       = "Something went wrong";
               var params    = null;
           } else {
               var template  = "views/project.ejs";
               var err       = null;
               var msg       = null;
               var params    = {project: updatedProject, auth_lvl: req.session.auth_lvl, uid: req.session.uid};
           }
            responseDispatcher(req, res, template, err, msg, params);
        });
    }
});

/* POST register project */
router.post("/projects/create", function(req, res) {
    bl_inst.addProject(req.body.name, req.body.description, req.body.images, req.body.video,
        req.body.targetSum, req.body.targetDate, req.session.username, req.body.bankAccount, function(err, projId) {
            if(err) {
                logger.err(TAG, err);

                var template  = "views/generic-message.ejs";
                var err       = null;
                var msg       = "Something went wrong";
                var params    = null;

                responseDispatcher(req, res, template, err, msg, params);
            }
            else {
                bl_inst.getProjectLogicInterface().getProjectById(projId, function(i_err, project) {
                    if(i_err) {
                        logger.err(TAG, i_err);

                        var template  = "views/generic-message.ejs";
                        var err       = null;
                        var msg       = "Project Registered Successfully!";
                        var params    = null;


                    } else {
                        var template  = "views/project.ejs";
                        var err       = null;
                        var msg       = "Project Registered Successfully!";
                        var params    = {project: project, auth_lvl: req.session.auth_lvl, uid: req.session.uid};

                    }
                    responseDispatcher(req, res, template, err, msg, params);
                });

            }
        });
});

/* POST donate project */
router.post("/projects/:id/donate", function(req, res) {
  bl_inst.addDonation(req.params.id, req.session.username, req.body.credit_card, 1111, req.body.sum, function(err, donationId) {
      if(err) {
          logger.err(TAG, err);

          var template  = "views/donation-form.ejs";
          var err       = "Something went wrong, please try again";
          var msg       = null;
          var params    = {projectId: req.params.id};
          responseDispatcher(req, res, template, err, msg, params);
      } else {
          bl_inst.getProjectLogicInterface().getProjectById(req.params.id, function (i_err, project) {
              if (i_err) {
                  var template = "views/generic-message.ejs";
                  var err = null;
                  var msg = "Donation Processed Successfully!";
                  var params = null;
              } else {
                  var template = "views/project.ejs";
                  var err = null;
                  var msg = "Donation Processed Successfully!";
                  var params = {project: project, auth_lvl: req.session.auth_lvl, uid: req.session.uid};
              }
              responseDispatcher(req, res, template, err, msg, params);
          });
      }
  });
});

/** ******************************************************************************************
 *          USER ROUTES
 *  *******************************************************************************************/
/* POST sign up form */
router.get("/users/signup", function(req, res) {
    var template  = "views/signup-form.ejs";
    var err       = null;
    var msg       = null;
    var params    = null;

    responseDispatcher(req, res, template, err, msg, params);
});

/* POST sign up form */
router.post("/users/signup", function(req, res) {
    bl_inst.getUserLogicInterface().createAccount(req.body.username, req.body.password, req.body.type, function(err, userId, username, auth_lvl) {
        if(err) {
            logger.err(TAG, err);

            var template  = "views/signup-form.ejs";
            var err       = "Something went wrong, please try again";
            var msg       = null;
            var params    = null;

            responseDispatcher(req, res, template, err, msg, params);
        } else {
            logger.info(username);
            logger.info(auth_lvl);
            req.session.username = username;
            req.session.auth_lvl = auth_lvl;

            bl_inst.getProjectLogicInterface().getAllActiveProjects(function(i_err, projects) {
               if(i_err) {
                   logger.err(TAG, i_err);

                   var template = "views/generic-message.ejs";
                   var err = null;
                   var msg = "Account Created Successfully!";
                   var params = null;
               } else {
                   var template  = "views/projects.ejs";
                   var err       = null;
                   var msg       = "Account Created Successfully";
                   var params    = {projects: projects};
               }
                responseDispatcher(req, res, template, err, msg, params);
            });



        }
    });
});

/* GET login form */
router.get("/users/login", function(req, res) {
    var template  = "views/login-form.ejs";
    var err       = null;
    var msg       = null;
    var params    = null;

    responseDispatcher(req, res, template, err, msg, params);
});

/* POST login form */
router.post("/users/login", function(req, res) {
    bl_inst.getUserLogicInterface().authenticate(req.body.username, req.body.password, function(err, userId, auth_lvl) {
        if(err) {
            logger.err(TAG, err);

            var template  = "views/login-form.ejs";
            var err       = "Something went wrong, please try again";
            var msg       = null;
            var params    = null;

            responseDispatcher(req, res, template, err, msg, params);
        } else {
            req.session.username    = req.body.username;
            req.session.auth_lvl    = auth_lvl;
            req.session.uid         = userId;

            bl_inst.getProjectLogicInterface().getAllActiveProjects(function(i_err, projects) {
                if(i_err) {
                    logger.err(TAG, i_err);

                    var template = "views/generic-message.ejs";
                    var err = null;
                    var msg = "Logged In Successfully!";
                    var params = null;
                } else {
                    var template  = "views/projects.ejs";
                    var err       = null;
                    var msg       = "Account Created Successfully";
                    var params    = {projects: projects};
                }
                responseDispatcher(req, res, template, err, msg, params);
            });
        }
    });
});

/* GET logout */
router.get("/users/logout", function(req, res) {
    var loggedin_modified = false;

    if(req.session.username && req.session.auth_lvl > 0) {
        req.session.username    = null;
        req.session.auth_lvl    = -1;
        req.session.uid         = null;
        loggedin_modified = true;
    }
    bl_inst.getProjectLogicInterface().getAllActiveProjects(function(i_err, projects) {
        if(i_err) {
            logger.err(TAG, i_err);

            var template = "views/generic-message.ejs";
            var err = null;
            var msg = loggedin_modified ? "Logged Out Successfully!" : "You are not logged in!";
            var params = null;
        } else {
            var template  = "views/projects.ejs";
            var err       = null;
            var msg       = loggedin_modified ? "Logged Out Successfully!" : "You are not logged in!";
            var params    = {projects: projects};
        }
        responseDispatcher(req, res, template, err, msg, params);
    });

});

/* GET user list */
router.get("/users", function(req, res) {
    if(!bl_inst.getUserLogicInterface().isAdmin(req.session.auth_lvl)) {
        var template  = "views/generic-message.ejs";
        var err       = null;
        var msg       = "Unauthorized";
        var params    = null;

        responseDispatcher(req, res, template, err, msg, params);

    } else {
        bl_inst.getUserLogicInterface().getUsers(function(err, users) {
            if(err) {
                var template  = "views/generic-message.ejs";
                var err       = null;
                var msg       = "Something went wrong";
                var params    = null;

                responseDispatcher(req, res, template, err, msg, params);

            } else {
                var template  = "views/userlist.ejs";
                var err       = null;
                var msg       = null;
                var params    = {users: users};

                responseDispatcher(req, res, template, err, msg, params);
            }
        });
    }
});

module.exports = router;
