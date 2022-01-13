const bcrypt = require("bcryptjs/dist/bcrypt")
const req = require("express/lib/request")
const Cart = require("../models/cart")

module.exports = function(app) {
    app.get("/", (req, res) => {
        res.render("index", { title: 'eBuy - Home Page' })
    })
    app.get("/products", (req, res) => {
        db.query('SELECT * FROM products', (err, result) => {
            if (err) {
                console.log(err)
            } else {
                if (result.length == 0) {
                    req.session.message = {
                        type: 'error',
                        message: "Sorry, there are currently no available products."
                    }
                    res.redirect('index');
                } else {
                    res.render("products", { title: 'eBuy - Products', availableProducts: result })
                }
            }
        })

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
    app.get("/products-details", (req, res) => {
        db.query('SELECT * FROM products WHERE id = ?', req.query.id, (err, result) => {
            if (err) {
                console.log(err)
            } else if (result.length != 0) {
                // Cart.save(result[0])
                // console.log(Cart.getCart())
                res.render("products-details", { title: 'eBuy - Product Name', product: result[0] })
            }
        })
    })

    app.post("/products-details", (req, res) => {
        const { product_size, product_amount, product_photo, product_name, product_price, id } = req.body
            // let addedProduct = [product_size, product_amount, product_photo, product_name, product_price, id]
            // db.query("INSERT INTO cart_products (product_size, product_amount, product_photo, product_name, product_price, products_id) VALUES (?,?,?,?,?,?)", addedProduct, (err, result) => {
            //     if (err) {
            //         console.log(err)
            //     } else {
            //         req.session.message = {
            //             type: 'success',
            //             message: 'Successfully added ' + req.body.product_name + ' to the cart.'
            //         }
            //         res.redirect('back')
            //     }
            // })


        // let addedProduct = [product_size, parseInt(product_amount), product_photo, product_name, parseFloat(product_price), id]
        // db.query("SELECT * FROM products WHERE id = ?", req.body.id, (err, result) => {
        // console.log(req.body.product_price)
        // parseFloat(req.body.product_price)
        req.body.product_price = parseFloat(req.body.product_price)
        req.body.product_amount = parseFloat(req.body.product_amount)
        req.body.id = parseInt(req.body.id)
        Cart.save(req.body)
        console.log(Cart.getCart())
        req.session.message = {
            type: 'success',
            message: 'Successfully added ' + req.body.product_name + ' to the cart.'
        }
        res.redirect('back')

        // res.render('cart', { title: 'eBuy - Shopping Cart', product: req.body })
        // })
    })

    // app.get("/product-details:id", (req, res) => {
    //     console.log(req.params.id)
    // })
    app.get("/cart", (req, res) => {
        const cart = Cart.getCart()
        if (cart == null || cart.products.length == 0) {
            res.render('cart-empty', { title: 'eBuy - Shopping Cart' })
        } else {
            console.log(cart)
            res.render("cart", { title: 'eBuy - Shopping Cart', cart: cart })
        }
    })

    app.get("/remove-product", (req, res) => {
        Cart.delete(req.query.id)
        res.redirect("cart")
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