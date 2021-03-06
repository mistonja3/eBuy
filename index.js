const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const port = process.env.PORT || 3000
const http = require('http')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
dotenv.config({ path: "./.env" })
const session = require("express-session");

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
    secret: 'secret',
    cookie: { maxAge: Date.now() + (30 * 86400 * 1000) },
    resave: false,
    saveUninitialized: false
}))

app.use(function(req, res, next) {
    res.locals.message = req.session.message;
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

app.set('view engine', 'ejs')
require("./routes/main")(app);
//using static files like images and stylesheets
app.use('/assets', express.static('assets'));
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

const server = http.createServer(app)
server.listen(port, () => console.log(`Server up on port ${port}`))
