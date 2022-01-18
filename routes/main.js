const bcrypt = require("bcryptjs/dist/bcrypt")
const Cart = require("../models/cart")

module.exports = function(app) {
    app.get("/", (req, res) => {
        let user = req.session.user
        if (user) {
            res.redirect("/home")
        } else {
            db.query('SELECT * FROM products', (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('index', { title: 'eBuy - Home Page', availableProducts: result })
                }
            })
        }
    })

    app.get("/home", (req, res) => {
        let user = req.session.user
        if (user) {
            // console.log(req.session)
            db.query('SELECT * FROM products', (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('home', { title: 'eBuy - Home Page', name: user[0].name, availableProducts: result })
                }
            })
        } else {
            res.redirect("/")
        }

    })

    app.get("/products", (req, res) => {
        let user = req.session.user
        if (user) {
            db.query('SELECT * FROM products', (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    if (result.length == 0) {
                        req.session.message = {
                            type: 'error',
                            message: "Sorry, there are currently no available products."
                        }
                        res.redirect('/');
                    } else {
                        res.render("logged-products", { title: 'eBuy - Products', name: user[0].name, availableProducts: result })
                    }
                }
            })
        } else {
            db.query('SELECT * FROM products', (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    if (result.length == 0) {
                        req.session.message = {
                            type: 'error',
                            message: "Sorry, there are currently no available products."
                        }
                        res.redirect('/');
                    } else {
                        res.render("products", { title: 'eBuy - Products', availableProducts: result })
                    }
                }
            })
        }
    })

    app.get("/support", (req, res) => {
        let user = req.session.user
        if (user) {
            res.render("logged-support", { title: 'eBuy - Support', name: user[0].name })
        } else {
            res.render("support", { title: 'eBuy - Support' })
        }
    })

    app.get("/products-details", (req, res) => {
        let user = req.session.user
        if (user) {
            db.query('SELECT * FROM products WHERE id = ?', req.query.id, (err, result) => {
                if (err) {
                    console.log(err)
                } else if (result.length != 0) {
                    res.render("logged-products-details", { title: 'eBuy - Product Name', name: user[0].name, product: result[0] })
                }
            })
        } else {
            db.query('SELECT * FROM products WHERE id = ?', req.query.id, (err, result) => {
                if (err) {
                    console.log(err)
                } else if (result.length != 0) {
                    res.render("products-details", { title: 'eBuy - Product Name', product: result[0] })
                }
            })
        }
    })

    app.post("/products-details", (req, res) => {
        if (req.body.product_size === "none" || req.body.product_amount == 0) {
            req.session.message = {
                type: 'error',
                message: 'Please select the size and/or amount of the item(s).'
            }
            res.redirect('back')
        } else {
            let user = req.session.user
            if (user) {
                let newProduct = [req.body.product_name, req.body.product_price, req.body.product_photo, req.body.product_size, req.body.product_amount, req.body.id, user[0].id]
                db.query("INSERT INTO cart_products (product_name, product_price, product_photo, product_size, product_amount, products_id, user_id) VALUES (?,?,?,?,?,?,?)", newProduct, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        req.session.message = {
                            type: 'success',
                            message: "Successfully added " + req.body.product_name + " to the cart."
                        }
                        res.redirect('back')
                    }
                })
            } else {
                req.body.product_price = parseFloat(req.body.product_price)
                req.body.product_amount = parseFloat(req.body.product_amount)
                req.body.id = parseInt(req.body.id)
                Cart.save(req.body)
                // console.log(Cart.getCart())
                req.session.message = {
                    type: 'success',
                    message: "Successfully added " + req.body.product_name + " to the cart."
                }
                res.redirect('back')
            }
        }
    })

    app.get("/cart", (req, res) => {
        let user = req.session.user
        if (user) {
            db.query("SELECT * FROM cart_products WHERE user_id = ?", user[0].id, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    if (result.length == 0) {
                        res.render("logged-cart-empty", { title: 'eBuy - Shopping Cart', name: user[0].name, availableProducts: result, product: result[0] })
                    } else {
                        res.render("logged-cart", { title: 'eBuy - Shopping Cart', name: user[0].name, availableProducts: result, product: result[0] })
                    }
                }
            })
        } else {
            //not storing products in database for non logged in users
            const cart = Cart.getCart()
            if (cart == null || cart.products.length == 0) {
                res.render('cart-empty', { title: 'eBuy - Shopping Cart' })
            } else {
                res.render("cart", { title: 'eBuy - Shopping Cart', cart: cart })
            }
        }
    })

    app.get("/remove-product", (req, res) => {
        let user = req.session.user
        if (user) {
            db.query("DELETE FROM cart_products WHERE id = ?", req.query.id, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    req.session.message = {
                        type: 'success',
                        message: "Successfully removed the item from the cart."
                    }
                    res.redirect("cart")
                }
            })
        } else {
            Cart.delete(req.query.id, req.query.product_size)
            // console.log(Cart.getCart())
            res.redirect("cart")
        }
    })

    app.post("/products", (req, res) => {
        if (req.body.product_category == 'All') {
            db.query('SELECT * FROM products', (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render("products-filter", { title: 'eBuy - Products', availableProducts: result })
                }
            })
        } else {
            db.query('SELECT * FROM products WHERE product_category = ?', req.body.product_category, (err, result) => {
                if (err) {
                    console.log(err)
                } else if (result.length == 0) {
                    req.session.message = {
                        type: 'error',
                        message: 'Sorry, no products under ' + req.body.product_category
                    }
                } else if (result.length != 0) {
                    res.render("products-filter", { title: 'eBuy - ' + req.body.product_category, availableProducts: result })
                }
            })
        }
    })

    app.post("/sort-by", (req, res) => {
        const { sort_by } = req.body
        if (sort_by == "high-low") {
            db.query('SELECT * FROM products ORDER BY product_price DESC', (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render("products-filter", { title: 'eBuy - Products', availableProducts: result })
                }
            })
        } else if (sort_by == "low-high") {
            db.query('SELECT * FROM products ORDER BY product_price ASC', (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render("products-filter", { title: 'eBuy - Products', availableProducts: result })
                }
            })
        } else if (sort_by == "a-z") {
            db.query('SELECT * FROM products ORDER BY product_name ASC', (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render("products-filter", { title: 'eBuy - Products', availableProducts: result })
                }
            })
        } else if (sort_by == "z-a") {
            db.query('SELECT * FROM products ORDER BY product_name DESC', (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render("products-filter", { title: 'eBuy - Products', availableProducts: result })
                }
            })
        }
    })

    app.get("/login", (req, res) => {
        res.render("login", { title: 'eBuy - Log In' })
    })

    app.get("/register", (req, res) => {
        res.render("register", { title: 'eBuy - Register' })
    })

    app.get("/logout", (req, res, next) => {
        if (req.session.user) {
            req.session.destroy(() => {
                res.redirect('/')
            })
        }
    })

    app.post("/register", (req, res) => {
        const { name, email, username, password } = req.body;
        if (email == "" || password == "" || name == "" || username == "") {
            req.session.message = {
                type: 'error',
                message: 'Please fill in all the fields.'
            }
            res.redirect('back')
        }else{
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
                            // console.log(result)
                            req.session.message = {
                                type: 'success',
                                message: 'Successfully registered an account!'
                            }
                            res.redirect('login')
                        }
                    })
                }
            })
        }
        
    })
    
    app.post("/login", (req, res) => {
        const { email, password } = req.body;
        db.query('SELECT id, name, email, password FROM users WHERE email = ?', [email], async(err, result) => {
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
                    req.session.user = result
                    // console.log(result)
                    req.session.message = {
                        type: 'success',
                        message: 'Welcome, ' + result[0].name + '!'
                    }
                    res.redirect('home')
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