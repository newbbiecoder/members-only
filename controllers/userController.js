const pool = require("../config/pool");
const bcrypt = require("bcryptjs");

function renderLoginIndexPage(req, res) {
    res.render("index", {
        title: "HomePage",
        user: req.user
    })
}

function signUpPageGet(req, res) {
    res.render("sign-up-form", {
        title: "Sign Up"
    })
}

async function signUpPagePost(req, res, next) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.query("INSERT INTO users (username, fullname, password, memberstatus, isadmin) VALUES ($1, $2, $3, $4, $5)", [
            req.body.username,
            req.body.firstName + " " + req.body.lastName,
            hashedPassword,
            false,
            false,
        ])
        res.redirect("/");
    }
    catch(err) {
        return next(err);
    }
}

function logOutGet(req, res, next) {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        res.redirect("/");
    })
}

function becomeMemberGet(req, res) {
    res.render("membership-pass", {
        title: "Become A Member"
    })
}

async function becomeMemberPost(req, res) {
    if(req.body.memberPass === "ilovecats") {
        await pool.query("UPDATE users SET memberstatus = 't' WHERE id = $1", [req.user.id]);
        req.flash('success', 'Membership Availed Successfully!');
        
        // Force the save before redirecting
        return req.session.save(() => {
            res.redirect("/");
        });
    }
    else {
        req.flash('error', 'Invalid passcode!');
        
        // Force the save before redirecting
        return req.session.save(() => {
            res.redirect("/become-member");
        });
    }
}

module.exports = {
    renderLoginIndexPage,
    signUpPageGet,
    signUpPagePost,
    logOutGet,
    becomeMemberGet,
    becomeMemberPost
}