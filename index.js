const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const port = process.env.PORT || 3000
const http = require('http')
const reload = require('reload')
const bcrypt = require('bcryptjs')
    // const flash = require('connect-flash')
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv')
dotenv.config({ path: "./.env" })
const session = require("express-session");
// var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
};

// var db = mysql.createPool(options);
// var sessionStore = new MySQLStore({}, db);

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser('secret'));
app.use(session({
        secret: 'secret',
        cookie: { maxAge: null },
        resave: false,
        // store: sessionStore,
        saveUninitialized: false
    }))
    // app.use(flash())
app.use(function(req, res, next) {
    res.locals.message = req.session.message;
    // res.locals.session = req.session
    delete req.session.message;
    next();
})


const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
})



//connect to database
db.getConnection((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to database");
    }
});

global.db = db
global.bcrypt = bcrypt

app.set('view engine', 'ejs')
require("./routes/main")(app);
//using static files like images and stylesheets
app.use('/assets', express.static('assets'));
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

const server = http.createServer(app)
server.listen(port, () => console.log(`Server up on port ${port}`))
    // reload(app)