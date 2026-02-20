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
        await pool.query("INSERT INTO users (fullname, password, memberstatus, isadmin) VALUES ($1, $2, $3, $4)", [
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


module.exports = {
    renderLoginIndexPage,
    signUpPageGet,
    signUpPagePost,
}