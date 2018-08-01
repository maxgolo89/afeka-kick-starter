function draw_navbar_right(username, auth_lvl) {
    var loginTag = document.getElementById("login");
    var signupTag = document.getElementById("signup");
    var logoutTag = document.getElementById("logout");
    var usernameTag = document.getElementById("username");
    if(auth_lvl && auth_lvl != -1) {
        loginTag.classList.add("hidden");
        signupTag.classList.add("hidden");
        logoutTag.classList.remove("hidden");
        usernameTag.classList.remove("hidden");
        usernameTag.firstElementChild.innerHTML = "Hello, " + username;
    } else {
        loginTag.classList.remove("hidden");
        signupTag.classList.remove("hidden");
        logoutTag.classList.add("hidden");
        usernameTag.classList.add("hidden");
        usernameTag.firstElementChild.innerHTML = "Hello, " + username;
    }
}

function draw_navbar_left(selected_tab) {

}

function draw_header(header) {
    var hc = document.getElementById("header-container");
    hc.innerHTML = header;
}

function draw_content(body) {
    var cc = document.getElementById("content-container");
    cc.innerHTML = body;
}

function projects() {
    var xml = new XMLHttpRequest();
    xml.open("GET", "/projects", true);
    xml.send();

    xml.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            var jRes = JSON.parse(this.responseText);
            draw_navbar_right(jRes.username, jRes.auth_lvl);
            draw_navbar_left(0);
            draw_header(jRes.header);
            draw_content(jRes.data);
        }
        else {
            console.log("ERROR");
        }
    };
}

function project(id) {
    var xml = new XMLHttpRequest();
    xml.open("GET", "/projects/" + id, true);
    xml.send();

    xml.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            var jRes = JSON.parse(this.responseText);
            draw_navbar_right(jRes.username, jRes.auth_lvl);
            draw_navbar_left(0, jRes.auth_lvl);
            draw_header(jRes.header);
            draw_content(jRes.data);
        }
        else {
            console.log("ERROR");
        }
    };
}

function donate_form(id) {
    var xml = new XMLHttpRequest();
    xml.open("GET", "/project/" + id + "/donate" , true);
    xml.send();

    xml.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            var jRes = JSON.parse(this.responseText);
            draw_navbar_right(jRes.username, jRes.auth_lvl);
            draw_navbar_left(1);
            draw_header(jRes.header);
            draw_content(jRes.data);
        }
        else {
            console.log("ERROR");
        }
    };
}

function donate() {
    var p_id = document.getElementById("project-id").value;
    var c_card = document.getElementById("credit_card").value;
    var sum = document.getElementById("sum").value;

    if(!c_card || !sum || c_card == "" || sum == "")
        alert("All field are mandatory");
    else {
        var dataStr = "credit_card=" + c_card + "&sum=" + sum;

        var xml = new XMLHttpRequest();
        xml.open("POST", "/project/" + p_id + "/donate" , true);
        xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xml.send(dataStr);

        xml.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                var jRes = JSON.parse(this.responseText);
                draw_navbar_right(jRes.username, jRes.auth_lvl);
                draw_navbar_left(1);
                draw_header(jRes.header);
                draw_content(jRes.data);
            }
            else {
                console.log("ERROR");
            }
        };
    }

}

function kickedoutprojects() {
    var xml = new XMLHttpRequest();
    xml.open("GET", "/kickedoutprojects", true);
    xml.send();

    xml.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            var jRes = JSON.parse(this.responseText);
            draw_navbar_right(jRes.username, jRes.auth_lvl);
            draw_navbar_left(1);
            draw_header(jRes.header);
            draw_content(jRes.data);
        }
        else {
            console.log("ERROR");
        }
    };
}

function project_register_form() {
    var xml = new XMLHttpRequest();
    xml.open("GET", "/create/project", true);
    xml.send();

    xml.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            var jRes = JSON.parse(this.responseText);
            draw_navbar_right(jRes.username, jRes.auth_lvl);
            draw_navbar_left(1);
            draw_header(jRes.header);
            draw_content(jRes.data);
        }
        else {
            console.log("ERROR");
        }
    };
}

function project_register() {
    var p_name = document.getElementById("name").value;
    var p_desc = document.getElementById("description").value;
    var p_image_1 = document.getElementById("image_1").value;
    var p_image_2 = document.getElementById("image_2").value;
    var p_image_3 = document.getElementById("image_3").value;
    var p_video = document.getElementById("video").value;
    var p_sum = document.getElementById("target-sum").value;
    var p_date = document.getElementById("target-date").value;
    var p_account = document.getElementById("bank-account").value;

    if(!p_name || !p_desc || !p_image_1 || !p_sum || !p_date || !p_account || p_name == "" || p_desc == "" || p_image_1 == "" || p_sum == "" || p_date == "" || p_account == "") {
        alert("At least one image, and all other fields are mandatory, except video");
    } else {
        var dataStr = "name=" + p_name + "&description=" + p_desc
            + "&images=" + p_image_1 + "&images=" + p_image_2
            + "&images=" + p_image_3 + "&video=" + p_video
            + "&targetSum=" + p_sum + "&targetDate=" + p_date
            + "&bankAccount=" + p_account;
    }


    var xml = new XMLHttpRequest();
    xml.open("POST", "/create/project", true);
    xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xml.send(dataStr);

    xml.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            var jRes = JSON.parse(this.responseText);
            draw_navbar_right(jRes.username, jRes.auth_lvl);
            draw_navbar_left(1);
            draw_header(jRes.header);
            draw_content(jRes.data);
        }
        else {
            console.log("ERROR");
        }
    };
}

function user_create_form() {
        var xml = new XMLHttpRequest();
        xml.open("GET", "/signup", true);
        xml.send();

        xml.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                var jRes = JSON.parse(this.responseText);
                draw_navbar_right(jRes.username, jRes.auth_lvl);
                draw_navbar_left(1);
                draw_header(jRes.header);
                draw_content(jRes.data);
            }
            else {
                console.log("ERROR");
            }
        };
}

function user_create() {
    var username = document.getElementById("username_tb").value;
    var password = document.getElementById("password_tb").value;
    var password_c = document.getElementById("password_c_tb").value;
    var type = "";

    if(document.getElementById("inlineRadio1").checked)
        type = document.getElementById("inlineRadio1").value;
    else if(document.getElementById("inlineRadio2").checked)
        type = document.getElementById("inlineRadio2").value;

    if(!username || !password || !type || username == "" || password == "" || type == "") {
        alert("All field are mandatory");
    } else if(password != password_c) {
        alert("Password fields must match");
    } else {
        var dataStr = "username=" + username + "&password=" + password + "&type=" + type;

        var xml = new XMLHttpRequest();
        xml.open("POST", "/signup", true);
        xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xml.send(dataStr);

        xml.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                var jRes = JSON.parse(this.responseText);
                draw_navbar_right(jRes.username, jRes.auth_lvl);
                draw_navbar_left(1);
                draw_header(jRes.header);
                draw_content(jRes.data);
            }
            else {
                console.log("Login Error");
            }
        };
    }
}

function login_form() {
    var xml = new XMLHttpRequest();
    xml.open("GET", "/login", true);
    xml.send();

    xml.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            var jRes = JSON.parse(this.responseText);
            draw_navbar_right(jRes.username, jRes.auth_lvl);
            draw_navbar_left(1);
            draw_header(jRes.header);
            draw_content(jRes.data);
        }
        else {
            console.log("ERROR");
        }
    };
}

function login() {
    var username = document.getElementById("username_tb").value;
    var password = document.getElementById("password_tb").value;

    if(!username || !password || username == "" || password == "") {
        alert("All field are mandatory");
    } else {
        var dataStr = "username=" + username + "&password=" + password;

        var xml = new XMLHttpRequest();
        xml.open("POST", "/login", true);
        xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xml.send(dataStr);

        xml.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                var jRes = JSON.parse(this.responseText);
                draw_navbar_right(jRes.username, jRes.auth_lvl);
                draw_navbar_left(1);
                draw_header(jRes.header);
                draw_content(jRes.data);
            }
            else {
                console.log("Login Error");
            }
        };
    }
}



function logout() {
    var xml = new XMLHttpRequest();
    xml.open("GET", "/logout", true);
    xml.send();

    xml.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            var jRes = JSON.parse(this.responseText);
            draw_navbar_right(jRes.username, jRes.auth_lvl);
            draw_navbar_left(-1);
            draw_header(jRes.header);
            draw_content(jRes.data);
        }
        else {
            console.log("ERROR");
        }
    };
}

function userlist() {
    var xml = new XMLHttpRequest();
    xml.open("GET", "/userlist", true);
    xml.send();

    xml.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            var jRes = JSON.parse(this.responseText);
            draw_navbar_right(jRes.username, jRes.auth_lvl);
            draw_navbar_left(jRes.auth_lvl);
            draw_header(jRes.header);
            draw_content(jRes.data);
        }
        else {
            console.log("ERROR");
        }
    };
}

window.onload = function() {
    projects();
};