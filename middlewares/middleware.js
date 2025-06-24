const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash("error","You must be logged in to access this page");
        res.redirect("/login");
    }
}

module.exports = {
    isLoggedIn
};