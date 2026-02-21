require("dotenv").config({path: ".env"});

const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");

const PostgresSession = require("connect-pg-simple")(expressSession);
const pgPool = require("./config/pool");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Make Session Store

app.use(expressSession({
    store: new PostgresSession({
        pool: pgPool
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 30 * 24 * 60 * 60 * 1000}
}));

// Require passport config
require("./config/passport");

// Use flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    console.log(req.user)
    next();
})

// Use our indexRouter
app.use("/", indexRouter);

app.listen(3000, (error) => {
    if(error) {
        throw error;
    }
    console.log("Listening on PORT 3000");
})