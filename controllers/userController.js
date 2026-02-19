function createLoginForm(req, res) {
    res.render("log-in-form", {
        title: "Log In Form"
    })
}


module.exports = {
    createLoginForm,
}