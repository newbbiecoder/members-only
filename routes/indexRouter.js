const {Router} = require("express");
const {renderLoginIndexPage, signUpPageGet, signUpPagePost, logOutGet} = require("../controllers/userController");
const passport = require("passport");

const indexRouter = Router();

indexRouter.get("/", renderLoginIndexPage);
indexRouter.get("/sign-up", signUpPageGet);
indexRouter.post("/sign-up", signUpPagePost);
indexRouter.post("/log-in", 
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
    })
)
indexRouter.get("/log-out", logOutGet)

module.exports = indexRouter;