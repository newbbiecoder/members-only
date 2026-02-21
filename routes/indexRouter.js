const {Router} = require("express");
const {renderLoginIndexPage, signUpPageGet, signUpPagePost, authenticateUser, logOutGet, becomeMemberGet, becomeMemberPost, newMessageGet, newMessagePost, deleteMessagePost, updateMessageGet, updateMessagePost} = require("../controllers/userController");
const passport = require("passport");
const isAuth = require("./authMiddleware").isAuth;

const indexRouter = Router();

indexRouter.get("/", renderLoginIndexPage);
indexRouter.get("/sign-up", signUpPageGet);
indexRouter.post("/sign-up", signUpPagePost);
indexRouter.post("/log-in", authenticateUser)
indexRouter.get("/become-member", isAuth, becomeMemberGet);
indexRouter.post("/become-member", becomeMemberPost)
indexRouter.get("/new-message", isAuth, newMessageGet);
indexRouter.post("/new-message", newMessagePost)
indexRouter.post("/:id/delete", deleteMessagePost);
indexRouter.get("/:id/update", isAuth, updateMessageGet);
indexRouter.post("/:id/update", updateMessagePost);
indexRouter.get("/log-out", logOutGet)

module.exports = indexRouter;