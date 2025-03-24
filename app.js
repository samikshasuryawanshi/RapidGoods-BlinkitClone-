const express = require('express');
const app = express();
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth")
const adminRouter = require("./routes/admin")
const productRouter = require("./routes/product")
const categoryRouter = require("./routes/category")
const cartRouter = require("./routes/cart")
const userRouter = require("./routes/user")
const path = require('path')
const expressSession = require("express-session")
const cookieParser = require("cookie-parser");
const passport = require('passport');

require('dotenv').config();
require("./config/db");

app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.SESSION_SECRET,
}))


app.use(passport.initialize())
app.use(passport.session());
app.use(cookieParser());

require("./config/google_oauth_config")


app.use("/", indexRouter)
app.use("/auth",authRouter)
app.use("/admin",adminRouter)
app.use("/products",productRouter)
app.use("/categories",categoryRouter)
app.use("/users",userRouter)
app.use("/cart",cartRouter)


app.listen(3000)