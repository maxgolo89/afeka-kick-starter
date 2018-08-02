/** *********************************************************************
 *       Global variables
 *  **********************************************************************/
var GET     = "GET";
var POST    = "POST";

/** *********************************************************************
*       Document drawing handlers
*  **********************************************************************/
function draw_hide_element(element) {
    if(!element.classList.contains("hidden"))
        element.classList.add("hidden")
}

function draw_unhide_element(element) {
    if(element.classList.contains("hidden"))
        element.classList.remove("hidden")
}

function draw_navbar_right(username, auth_lvl) {
    /* Element hooks */
    var loginTag        = document.getElementById("login");
    var signupTag       = document.getElementById("signup");
    var logoutTag       = document.getElementById("logout");
    var usernameTag     = document.getElementById("username");

    /* User login validation.
     * Logged in - Show Hello, username, and logout button.
     * Not logged in - Show login and signup buttons.  */
    if(auth_lvl && auth_lvl != -1) {
        draw_hide_element(loginTag);
        draw_hide_element(signupTag);
        draw_unhide_element(logoutTag);
        draw_unhide_element(usernameTag);

        usernameTag.firstElementChild.innerHTML = "Hello, " + username;
    } else {
        draw_unhide_element(loginTag);
        draw_unhide_element(signupTag);
        draw_hide_element(logoutTag);
        draw_hide_element(usernameTag);
    }
}

function draw_navbar_left(auth_lvl) {
    /* Element hooks */
    var projectsTag     = document.getElementById("project");
    var kickedoutTag    = document.getElementById("kickedout");
    var myprojects      = document.getElementById("myprojects");
    var usersTag        = document.getElementById("user_list");
    var newProjectTag   = document.getElementById("register_project");

    /* Show only tabs relevant to authorization level */
    switch(auth_lvl) {
        case 1:
            draw_unhide_element(projectsTag);
            draw_unhide_element(kickedoutTag);
            draw_unhide_element(myprojects);
            draw_unhide_element(usersTag);
            draw_unhide_element(newProjectTag);
            break;
        case 2:
            draw_unhide_element(projectsTag);
            draw_unhide_element(kickedoutTag);
            draw_unhide_element(myprojects);
            draw_hide_element(usersTag);
            draw_unhide_element(newProjectTag);
            break;
        case -1:
        case 3:
        default:
            draw_unhide_element(projectsTag);
            draw_unhide_element(kickedoutTag);
            draw_hide_element(myprojects);
            draw_hide_element(usersTag);
            draw_hide_element(newProjectTag);
    }
}

function draw_header(header) {
    var hc = document.getElementById("header-container");
    hc.innerHTML = header;
}

function draw_content(body) {
    var cc = document.getElementById("content-container");
    cc.innerHTML = body;
}



/** *********************************************************************
 *       Request handlers
 *  **********************************************************************/

/** Handles the ajax requests.
 * Params: String URL(/path), String METHOD(GET/POST), String PARAMS(p1=val1&p2=val2)*/
function ajaxRequestHandler(url, method, paramStr) {
    var xml = new XMLHttpRequest();
    xml.open(method, url, true);
    if(paramStr && paramStr != "")
        xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xml.send(paramStr);

    xml.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            var jRes = JSON.parse(this.responseText);
            draw_navbar_right(jRes.username, jRes.auth_lvl);
            draw_navbar_left(jRes.auth_lvl);
            draw_header(jRes.header);
            draw_content(jRes.data);
        }
        else {
            draw_content("No Response from the server to " + url + " request");
        }
    };
}

/** Project list GET request handler */
function projects() {
    /* Request Configuration Params */
    var url         = "/projects";
    var method      = GET;
    var paramStr    = null;

    ajaxRequestHandler(url, method, paramStr);
}

/** Project list GET request handler */
function myProjects() {
    /* Request Configuration Params */
    var url         = "/projects/my";
    var method      = GET;
    var paramStr    = null;

    ajaxRequestHandler(url, method, paramStr);
}

/** Project GET request handler */
function project(id) {
    /* Request Params */
    var p_id        = id;

    /* Request Configuration Params */
    var url         = "/projects/" + p_id;
    var method      = GET;
    var paramStr    = null;

    ajaxRequestHandler(url, method, paramStr);
}

/** Project edit GET request handler */
function project_edit_form(id) {
    /* Request Params */
    var p_id        = id;

    /* Request Configuration Params */
    var url         = "/projects/" + p_id + "/edit";
    var method      = GET;
    var paramStr    = null;

    ajaxRequestHandler(url, method, paramStr);
}

/** Project edit GET request handler */
function project_edit() {
    /* Request Params */
    var p_id        = document.getElementById("project_id").value;
    var p_name      = document.getElementById("name").value;
    var p_desc      = document.getElementById("description").value;
    var p_image_1   = document.getElementById("image_1").value;
    var p_image_2   = document.getElementById("image_2").value;
    var p_image_3   = document.getElementById("image_3").value;
    var p_video     = document.getElementById("video").value;
    var p_sum       = document.getElementById("target-sum").value;
    var p_date      = document.getElementById("target-date").value;
    var p_account   = document.getElementById("bank-account").value;

    /* Request Configuration Params */
    var url         = "/projects/" + p_id + "/edit";
    var method      = POST;
    var paramStr    = "pid="    + p_id      + "&name="          + p_name
        + "&description="       + p_desc    + "&images="        + p_image_1
        + "&images="            + p_image_2 + "&images="        + p_image_3
        + "&video="             + p_video   + "&targetSum="     + p_sum
        + "&targetDate="        + p_date    + "&bankAccount="   + p_account;

    /* Request Params Validation */
    if(!p_name || !p_desc || !p_image_1 || !p_account || p_name == "" || p_desc == "" || p_image_1 == "" || p_account == "") {
        alert("Please fill all the mandatory fields");
    } else {
        ajaxRequestHandler(url, method, paramStr);
    }
}

/** Donation form GET request handler */
function donate_form() {
    /* Request Params */
    var p_id        = document.getElementById("project_id").value;

    /* Request Configuration Params */
    var url         = "/projects/" + p_id + "/donate";
    var method      = GET;
    var paramStr    = null;

    ajaxRequestHandler(url, method, paramStr);
}

/** Donation POST request handler */
function donate() {
    /* Request Params */
    var p_id        = document.getElementById("project_id").value;
    var c_card      = document.getElementById("credit_card").value;
    var sum         = document.getElementById("sum").value;

    /* Request Configuration Params */
    var url         = "/projects/" + p_id + "/donate";
    var method      = POST;
    var paramStr    = "credit_card=" + c_card + "&sum=" + sum;

    /* Request Params Validation */
    if(!c_card || !sum || c_card == "" || sum == "")
        alert("All field are mandatory");
    else {
        ajaxRequestHandler(url, method, paramStr);
    }

}

/** KickedOut Projects GET request handler*/
function kickedoutprojects() {
    /* Request Configuration Params */
    var url         = "/projects/kickedout";
    var method      = GET;
    var paramStr    = null;

    ajaxRequestHandler(url, method, paramStr);
}

/** Project registration form GET request handler */
function project_register_form() {
    /* Request Configuration Params */
    var url         = "/projects/create";
    var method      = GET;
    var paramStr    = null;

    ajaxRequestHandler(url, method, paramStr);
}

/** Project registration POST request handler */
function project_register() {
    /* Request Params */
    var p_name      = document.getElementById("name").value;
    var p_desc      = document.getElementById("description").value;
    var p_image_1   = document.getElementById("image_1").value;
    var p_image_2   = document.getElementById("image_2").value;
    var p_image_3   = document.getElementById("image_3").value;
    var p_video     = document.getElementById("video").value;
    var p_sum       = document.getElementById("target-sum").value;
    var p_date      = document.getElementById("target-date").value;
    var p_account   = document.getElementById("bank-account").value;

    /* Request Configuration Params */
    var url         = "/projects/create";
    var method      = POST;
    var paramStr    = "name=" + p_name + "&description=" + p_desc
                    + "&images=" + p_image_1 + "&images=" + p_image_2
                    + "&images=" + p_image_3 + "&video=" + p_video
                    + "&targetSum=" + p_sum + "&targetDate=" + p_date
                    + "&bankAccount=" + p_account;

    /* Request Params Validation */
    if(!p_name || !p_desc || !p_image_1 || !p_sum || !p_date || !p_account || p_name == "" || p_desc == "" || p_image_1 == "" || p_sum == "" || p_date == "" || p_account == "") {
        alert("Please fill all the mandatory fields");
    } else {
        ajaxRequestHandler(url, method, paramStr);
    }
}

/** User registration form GET request handler */
function user_create_form() {
    /* Request Configuration Params */
    var url         = "/users/signup";
    var method      = GET;
    var paramStr    = null;

    ajaxRequestHandler(url, method, paramStr);
}

/** User registration POST request handler */
function user_create() {
    /* Request Params */
    var username    = document.getElementById("username_tb").value;
    var password    = document.getElementById("password_tb").value;
    var password_c  = document.getElementById("password_c_tb").value;
    var type        = "";

    if(document.getElementById("inlineRadio1").checked)
        type = document.getElementById("inlineRadio1").value;
    else if(document.getElementById("inlineRadio2").checked)
        type = document.getElementById("inlineRadio2").value;

    /* Request Configuration Params */
    var url         = "/users/signup";
    var method      = POST;
    var paramStr    = "username=" + username + "&password=" + password + "&type=" + type;

    /* Request Params Validation */
    if(!username || !password || !type || username == "" || password == "" || type == "") {
        alert("All field are mandatory");
    } else if(password != password_c) {
        alert("Password fields must match");
    } else {
        ajaxRequestHandler(url, method, paramStr);
    }
}

/** User login form GET request handler */
function login_form() {
    /* Request Configuration Params */
    var url         = "/users/login";
    var method      = GET;
    var paramStr    = null;

    ajaxRequestHandler(url, method, paramStr);
}

/** User login POST request handler */
function login() {
    /* Request Params */
    var username = document.getElementById("username_tb").value;
    var password = document.getElementById("password_tb").value;

    /* Request Configuration Params */
    var url         = "/users/login";
    var method      = POST;
    var paramStr    = "username=" + username + "&password=" + password;

    /* Request Params Validation */
    if(!username || !password || username == "" || password == "") {
        alert("All field are mandatory");
    } else {
        ajaxRequestHandler(url, method, paramStr);
    }
}

/** User logout GET request handler */
function logout() {
    /* Request Configuration Params */
    var url         = "/users/logout";
    var method      = GET;
    var paramStr    = null;

    ajaxRequestHandler(url, method, paramStr);
}

/** User list GET request handler */
function userlist() {
    /* Request Configuration Params */
    var url         = "/users";
    var method      = GET;
    var paramStr    = null;

    ajaxRequestHandler(url, method, paramStr);
}

window.onload = function() {
    projects();
};