var path                    = require('path');
var express                 = require('express');
var ejs                     = require("ejs");
var router                  = express.Router();
var bl                      = require(path.join(__basedir, "business_logic/bl_management"));

var bl_inst = bl;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/** ******************************************************************************************
 *          PROJECT GET
 *  *******************************************************************************************/
/* GET home from ajax request */
router.get("/projects", function(req, res) {
  bl_inst.getProjectLogicInterface().getAllProjects(function(err, projects) {
      if(err) {
          ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {msg: "Something went wrong"}, function(e, body) {
              var response = {
                  err: null,
                  auth_lvl: req.session.auth_lvl,
                  username: req.session.username,
                  header: "Afeka KickStarter",
                  data: body
              };
              res.send(response);
          });
      } else {
        ejs.renderFile(path.join(__basedir, "views/projects.ejs"), {err: null, projects: projects}, function(e, body) {
            var response = {
                err: null,
                auth_lvl: req.session.auth_lvl,
                username: req.session.username,
                header: "Afeka KickStarter",
                data: body
            };
            res.send(response);
        });

      }
  });
});

/* GET project */
router.get("/projects/:id", function(req, res,) {
  bl_inst.getProjectLogicInterface().getProjectById(req.params.id, function(err, project) {
      if(err) {
          ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {msg: "Something went wrong"}, function(e, body) {
              var response = {
                  err: null,
                  auth_lvl: req.session.auth_lvl,
                  username: req.session.username,
                  header: "Afeka KickStarter",
                  data: body
              };

              res.send(JSON.stringify(response));
          });
      } else {
          ejs.renderFile(path.join(__basedir, "views/project.ejs"), {project: project, auth_lvl: req.session.auth_lvl}, function(e, body) {
              var response = {
                  err: null,
                  auth_lvl: req.session.auth_lvl,
                  username: req.session.username,
                  header: "Afeka KickStarter",
                  data: body
              };

              res.send(JSON.stringify(response));
          });

      }
  });
});

/* GET kicked out project */
router.get("/kickedoutprojects", function(req, res) {
    bl_inst.getProjectLogicInterface().getAllKickedOutProject(function(err, projects) {
        if(err)
            ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {msg: "Something went wrong"}, function(e, body) {
                var response = {
                    err: null,
                    auth_lvl: req.session.auth_lvl,
                    username: req.session.username,
                    header: "Afeka KickStarter",
                    data: body
                };

                res.send(JSON.stringify(response));
            });
        else {
            ejs.renderFile(path.join(__basedir, "views/projects.ejs"), {projects: projects}, function(e, body) {
                var response = {
                    err: null,
                    auth_lvl: req.session.auth_lvl,
                    username: req.session.username,
                    header: "Afeka KickStarter",
                    data: body
                };
                res.send(response);
            });
        }
    });
});

/** ******************************************************************************************
 *          PROJECT CREATE GET POST
 *  *******************************************************************************************/
/* GET register project */
router.get("/create/project", function(req, res) {
    if(req.session.auth_lvl == 2) {
        ejs.renderFile(path.join(__basedir, "views/project-create-form.ejs"), {err: null}, function(e, body) {
            var response = {
                err: null,
                auth_lvl: req.session.auth_lvl,
                username: req.session.username,
                header: "Afeka Kicked Out Projects",
                data: body
            };
            res.send(response);
        });
    } else {
        ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {err: null, msg: "Unauthorized"}, function(e, body) {
            var response = {
                err: null,
                auth_lvl: req.session.auth_lvl,
                username: req.session.username,
                header: "Afeka KickStarter",
                data: body
            };

            res.send(JSON.stringify(response));
        });
    }
});

/* POST register project */
router.post("/create/project", function(req, res) {
    bl_inst.addProject(req.body.name, req.body.description, req.body.images, req.body.video,
        req.body.targetSum, req.body.targetDate, req.session.username, req.body.bankAccount, function(err, projId) {
            if(err) {
                ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {err: null, msg: "Something went wrong"}, function(e, body) {
                    var response = {
                        err: null,
                        auth_lvl: req.session.auth_lvl,
                        username: req.session.username,
                        header: "Afeka KickStarter",
                        data: body
                    };

                    res.send(JSON.stringify(response));
                });
            }
            else {
                var response = {
                    err: null,
                    type: "project_added_view",
                    auth_lvl: req.session.auth_lvl,
                    username: req.session.username,
                    data: {projectId: projId}
                };

                res.send(JSON.stringify(response));
            }
        });
});

/** ******************************************************************************************
 *          PROJECT DONATE GET POST
 *  *******************************************************************************************/
/* GET donate project */
router.get("/project/:id/donate", function(req, res) {
    ejs.renderFile(path.join(__basedir, "views/donation-form.ejs"), {projectId: req.params.id, err: null},  function(e, body) {
        var response = {
            err: null,
            auth_lvl: req.session.auth_lvl,
            username: req.session.username,
            header: "Afeka KickStarter",
            data: body
        };

        res.send(JSON.stringify(response));
    });
});

/* POST donate project */
router.post("/project/:id/donate", function(req, res) {
  bl_inst.addDonation(req.params.id, req.session.username, req.body.credit_card, 1111, req.body.sum, function(err, donationId) {
      if(err) {
          ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {err: null, msg: "Something went wrong"}, function(e, body) {
              var response = {
                  err: null,
                  auth_lvl: req.session.auth_lvl,
                  username: req.session.username,
                  header: "Afeka KickStarter",
                  data: body
              };

              res.send(JSON.stringify(response));
          });
      }
      else {
          ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {err: null, msg: "Successful Donation!"},  function(e, body) {
              console.log(e);
              var response = {
                  err: null,
                  auth_lvl: req.session.auth_lvl,
                  username: req.session.username,
                  header: "Afeka KickStarter",
                  data: body
              };

              res.send(JSON.stringify(response));
          });
      }
  });
});

/** ******************************************************************************************
 *          SIGN UP GET POST
 *  *******************************************************************************************/
/* POST sign up form */
router.get("/signup", function(req, res) {
    ejs.renderFile(path.join(__basedir, "views/signup-form.ejs"), {err: null}, function(e, body) {

        var response = {
            err: null,
            auth_lvl: req.session.auth_lvl,
            username: req.session.username,
            header: "Afeka KickStarter",
            data: body
        };

        res.send(JSON.stringify(response));
    });
});

/* POST sign up form */
router.post("/signup", function(req, res) {
    bl_inst.getUserLogicInterface().createAccount(req.body.username, req.body.password, req.body.type, function(err, userId, username, auth_lvl) {
        if(err) {
            ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {err: null, msg: "Something went wrong"}, function(e, body) {
                var response = {
                    err: null,
                    auth_lvl: req.session.auth_lvl,
                    username: req.session.username,
                    header: "Afeka KickStarter",
                    data: body
                };

                res.send(JSON.stringify(response));
            });
        }
        else {
            req.session.username = username;
            req.session.auth_lvl = auth_lvl;

            ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {err: null, msg: "Successfully Signed Up!"}, function(e, body) {

                var response = {
                    err: null,
                    auth_lvl: req.session.auth_lvl,
                    username: req.session.username,
                    header: "Afeka KickStarter",
                    data: body
                };

                res.send(JSON.stringify(response));
            });
        }
    });
});

/** ******************************************************************************************
 *          LOGIN GET POST
 *  *******************************************************************************************/
/* GET login form */
router.get("/login", function(req, res) {
    ejs.renderFile(path.join(__basedir, "views/login-form.ejs"), {err: null}, function(e, body) {

        var response = {
            err: null,
            auth_lvl: req.session.auth_lvl,
            username: req.session.username,
            header: "Afeka KickStarter",
            data: body
        };

        res.send(JSON.stringify(response));
    });
});

/* POST login form */
router.post("/login", function(req, res) {
    bl_inst.getUserLogicInterface().authenticate(req.body.username, req.body.password, function(err, userId, auth_lvl) {
      if(err) {
          ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {err: null, msg: "Something went wrong"}, function(e, body) {
              var response = {
                  err: null,
                  auth_lvl: req.session.auth_lvl,
                  username: req.session.username,
                  header: "Afeka KickStarter",
                  data: body
              };

              res.send(JSON.stringify(response));
          });
      }
      else if(auth_lvl == -1) {

          ejs.renderFile(path.join(__basedir, "views/login-form.ejs"), {err: "Wrong Username or Password"}, function(e, body) {

              var response = {
                  err: null,
                  auth_lvl: -1,
                  username: null,
                  header: "Afeka KickStarter",
                  data: body
              };

              res.send(JSON.stringify(response));
          });
      }
      else {
          req.session.auth_lvl = auth_lvl;
          req.session.username = req.body.username;
          ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {msg: "Successful Login!"}, function(e, body) {

              var response = {
                  err: null,
                  auth_lvl: req.session.auth_lvl,
                  username: req.session.username,
                  header: "Afeka KickStarter",
                  data: body
              };

              res.send(JSON.stringify(response));
          });
      }
    });
});


/** ******************************************************************************************
 *          LOGOUT GET
 *  *******************************************************************************************/
/* GET logout */
router.get("/logout", function(req, res) {
  if(req.session.username && req.session.auth_lvl > 0)
    req.session.username = null;
    req.session.auth_lvl = -1;

    ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {err: "Wrong Username or Password"}, function(e, body) {

        var response = {
            err: null,
            auth_lvl: req.session.auth_lvl,
            username: req.session.username,
            header: "Afeka KickStarter",
            data: body
        };

        res.send(JSON.stringify(response));
    });
});

/** ******************************************************************************************
 *          USER LIST GET
 *  *******************************************************************************************/
/* GET user list */
router.get("/userlist", function(req, res) {
    if(req.session.username == "admin" && req.session.auth_lvl == 1) {
        bl_inst.getUserLogicInterface().getUsers(function(err, users) {
           if(err) {
               ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {err: null, msg: "Something went wrong"}, function(e, body) {
                   var response = {
                       err: null,
                       auth_lvl: req.session.auth_lvl,
                       username: req.session.username,
                       header: "Afeka KickStarter",
                       data: body
                   };

                   res.send(JSON.stringify(response));
               });
           } else {
               console.log("2");
               ejs.renderFile(path.join(__basedir, "views/userlist.ejs"), {err: null, users: users}, function(e, body) {
                   var response = {
                       err: null,
                       auth_lvl: req.session.auth_lvl,
                       username: req.session.username,
                       header: "Afeka KickStarter",
                       data: body
                   };

                   res.send(JSON.stringify(response));
               });
           }
        });
    } else {
        ejs.renderFile(path.join(__basedir, "views/generic-message.ejs"), {err: null, msg: "Unauthorized"}, function(e, body) {
            var response = {
                err: null,
                auth_lvl: req.session.auth_lvl,
                username: req.session.username,
                header: "Afeka KickStarter",
                data: body
            };

            res.send(JSON.stringify(response));
        });
    }
});

module.exports = router;
