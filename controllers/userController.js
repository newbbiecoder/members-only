const pool = require("../config/pool");
const bcrypt = require("bcryptjs");
const {body, validationResult, matchedData} = require("express-validator");
const passport = require("passport");

async function renderLoginIndexPage(req, res, next) {
    try {
        const {rows} = await pool.query(`
            SELECT messages.*, users.username, users.fullname
            FROM messages
            LEFT JOIN users ON messages.user_id = users.id
            ORDER BY messages.id DESC
        `);
        res.render("index", {
            title: "HomePage",
            user: req.user,
            messages: rows
        })
    } catch(err) {
        return next(err);
    }
}

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
    body("firstName").trim()
    .isAlpha().withMessage(`First Name ${alphaErr}`)
    .isLength({min: 1, max: 10}).withMessage(`First Name ${lengthErr}`),

    body("lastName").trim()
    .isAlpha().withMessage(`Last Name ${alphaErr}`)
    .isLength({min: 1, max: 10}).withMessage(`Last Name ${lengthErr}`),

    body("password").trim().isLength({min: 6, max: 25}).withMessage("Password should be atleast 6 characters long"),
    body("confirmPassword").custom((value, {req}) => {
        return value === req.body.password
    }).withMessage("Passwords do not match!"),

    body("username").trim()
    .isLength({min: 1, max: 10}).withMessage(`Username ${lengthErr}`),
]

function signUpPageGet(req, res, next) {
    try {
        res.render("sign-up-form", {
            title: "Sign Up"
        })
    }catch(err) {
        return next(err);
    }
}

let signUpPagePost = [
    validateUser,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).render("sign-up-form", {
                    title: "Sign Up",
                    errors: errors.array(),
                });
            }
            const {password} = matchedData(req);
            const hashedPassword = await bcrypt.hash(password, 10);
            
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
]

async function authenticateUser(req, res, next) {
    try {
        const {rows} = await pool.query(`
            SELECT messages.*, users.username, users.fullname
            FROM messages
            LEFT JOIN users ON messages.user_id = users.id
            ORDER BY messages.id DESC
        `);
        passport.authenticate("local", function(err, user, info) {
            if(err) {return next(err)}
            if(!user) {
                return res.render('index', {
                    title: "HomePage",
                    user: req.user,
                    messages: rows,
                    errMessage: info.message
                })
            }
            req.logIn(user, function(err) {
                if(err) return next(err);
                return res.redirect('/', )
            })
        })(req, res, next)
    } catch(err) {
        return next(err)
    }
}

function logOutGet(req, res, next) {
    try {
        req.logOut((err) => {
            if(err) {
                return next(err);
            }
            res.redirect("/");
        })
    } catch(err) {
        return next(err);
    }
}

function becomeMemberGet(req, res, next) {
    try {
        res.render("membership-pass", {
            title: "Become A Member"
        })
    } catch(err) {
        return next(err)
    }
}

async function becomeMemberPost(req, res, next) {
    try {
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
    } catch(err) {
        return next(err);
    }
}

function newMessageGet(req, res, next) {
    try {
        res.render("new-message", {
            title: "New Message"
        })
    }catch(err) {
        return next(err);
    }
}

async function newMessagePost(req, res, next) {
    try {
        await pool.query("INSERT INTO messages (title, description, user_id) VALUES ($1, $2, $3)", [req.body.title, req.body.description, req.user.id]);
        res.redirect("/");
    } catch(err) {
        return next(err);
    }
}

async function deleteMessagePost(req, res, next) {
    try {
        const messageId = req.params.id;
        await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
        res.redirect("/");
    } catch(err) {
        return next(err);
    }
}

async function updateMessageGet(req, res, next) {
    try {
        const messageId = req.params.id;
        const {rows} = await pool.query("SELECT * FROM messages WHERE id = $1", [messageId]);
        console.log(rows)
        res.render("edit-message", {
            title: "Edit Message",
            message: rows[0]
        })
    } catch(err) {
        return next(err);
    }
}

async function updateMessagePost(req, res, next) {
    try {
        const messageId = req.params.id;
        await pool.query("UPDATE messages SET title = $1, description = $2 WHERE id = $3", [req.body.title, req.body.description, messageId]);
        res.redirect("/");
    } catch(err) {
        return next(err);
    }
}

module.exports = {
    renderLoginIndexPage,
    signUpPageGet,
    signUpPagePost,
    authenticateUser,
    logOutGet,
    becomeMemberGet,
    becomeMemberPost,
    newMessageGet,
    newMessagePost,
    deleteMessagePost,
    updateMessageGet,
    updateMessagePost
}