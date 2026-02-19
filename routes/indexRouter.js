const {Router} = require("express");
const {createLoginForm} = require("../controllers/userController");

const indexRouter = Router();

indexRouter.get("/", createLoginForm);

module.exports = indexRouter;