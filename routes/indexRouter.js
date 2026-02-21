const {Router} = require("express");
const {renderLoginIndexPage, signUpPageGet, signUpPagePost, logOutGet, becomeMemberGet, becomeMemberPost, newMessageGet, newMessagePost} = require("../controllers/userController");
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
indexRouter.get("/become-member", becomeMemberGet);
indexRouter.post("/become-member", becomeMemberPost)
indexRouter.get("/new-message", newMessageGet);
indexRouter.post("/new-message", newMessagePost)
indexRouter.get("/log-out", logOutGet)

module.exports = indexRouter;