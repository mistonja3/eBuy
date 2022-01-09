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
                    let encryptedPassword = await bcrypt.hash(password, 10);

                    console.log(encryptedPassword)
                    req.session.message = {
                        type: 'success',
                        message: 'Successfully registered an account!'
                    }
                    res.redirect('login')
                }
            })
        })
        // app.post("/login", (req, res) => {

    //     const { name, email, username, password } = req.body;

    //     db.query('SELECT email FROM users WHERE email = ?', [email], (err, result) => {
    //         if (err) {
    //             console.log(err)
    //         } else if (result.length > 0) {
    //             req.session.message = {
    //                 type: 'error',
    //                 message: 'Email is already in use!'
    //             }
    //             res.redirect('register')
    //         } else {
    //             req.session.message = {
    //                 type: 'success',
    //                 message: 'Successfully registered an account!'
    //             }
    //             res.redirect('login')
    //         }
    //     })
    // })
}