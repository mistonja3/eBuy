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
        // try{
        //     const hashedPass = bcrypt.hash(res.body.password, 10)
        //     users.push
        // }
        // catch{

        // }

        // res.send(req.body.username)
    })

}