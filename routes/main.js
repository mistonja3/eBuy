const bcrypt = require("bcryptjs/dist/bcrypt")

module.exports = function(app) {
    app.get("/", (req, res) => {
        res.render("index", { title: 'eBuy - Home Page' })
    })
    app.get("/products", (req, res) => {
        res.render("products", { title: 'eBuy - Products' })
    })
    app.get("/about", (req, res) => {
        res.render("about", { title: 'eBuy - About' })
    })
    app.get("/support", (req, res) => {
        res.render("support", { title: 'eBuy - Support' })
    })
    app.get("/account", (req, res) => {
        res.render("account", { title: 'eBuy - Account' })
    })
    app.get("/cart", (req, res) => {
        res.render("cart", { title: 'eBuy - Shooping Cart' })
    })
    app.get("/products-details", (req, res) => {
        res.render("products-details", { title: 'eBuy - Product Name' })
    })
    app.get("/login", (req, res) => {
        res.render("login", { title: 'eBuy - Log In' })
    })
    app.get("/register", (req, res) => {
        res.render("register", { title: 'eBuy - Register' })
    })
    app.post("/register", (req, res) => {
        const { name, email, username, password } = req.body;
        db.query('SELECT email FROM users WHERE email = ?', [email], async(err, result) => {
            if (err) {
                console.log(err)
            } else if (result.length > 0) {
                req.session.message = {
                    type: 'error',
                    message: 'Email is already in use!'
                }
                res.redirect('register')
            } else {
                let hashedPassword = await bcrypt.hash(password, 10);
                db.query('INSERT INTO users SET ?', { name: name, username: username, email: email, password: hashedPassword }, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(result)
                        req.session.message = {
                            type: 'success',
                            message: 'Successfully registered an account!'
                        }
                        res.redirect('login')
                    }
                })
            }
        })
    })
    app.post("/login", (req, res) => {
        const { name, email, password } = req.body;
        db.query('SELECT name, email, password FROM users WHERE email = ?', [email], async(err, result) => {
            if (err) {
                console.log(err)
            } else if (result.length == 0) {
                req.session.message = {
                    type: 'error',
                    message: 'Wrong email and/or password!'
                }
                res.redirect('login')
            } else if (result[0].email == email) {
                const correctPass = await bcrypt.compare(password, result[0].password);
                if (correctPass) {
                    req.session.message = {
                        type: 'success',
                        message: 'Welcome, ' + result[0].name + '!'
                    }
                    res.redirect('login')
                } else {
                    req.session.message = {
                        type: 'error',
                        message: 'Wrong password!'
                    }
                    res.redirect('login')
                }

            } else if (result[0].email != email) {
                req.session.message = {
                    type: 'error',
                    message: 'Wrong email and/or password!'
                }
                res.redirect('login')
            }
        })
    })
}