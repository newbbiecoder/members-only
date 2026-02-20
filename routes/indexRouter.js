const {Router} = require("express");
const {renderLoginIndexPage, signUpPageGet, signUpPagePost} = require("../controllers/userController");

const indexRouter = Router();

indexRouter.get("/", renderLoginIndexPage);
indexRouter.get("/sign-up", signUpPageGet);
indexRouter.post("/sign-up", signUpPagePost)

module.exports = indexRouter;