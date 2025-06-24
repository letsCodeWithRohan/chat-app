const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/middleware");
const { signupController,loginController,getAllUsers,homeController,chatController } = require("../controllers/auth.controller");

router.get("/signup",(req,res) => res.render("signup",{
    title: "Signup",
    error: req.flash("error")
}));

router.get("/profile",isLoggedIn,(req,res) => {
    res.render("profile",{
        title: "Profile",
        user: req.session.user
    });
});

router.get("/edit-profile",isLoggedIn,(req,res) => {
    res.render("edit-profile",{
        title: "Edit Profile",
        user: req.session.user
    });
});

router.get("/login",(req,res) => res.render("login",{
    title: "Login",
    error: req.flash("error"),
    success: req.flash("success")
}));

router.get("/logout",isLoggedIn,(req,res) => {
    req.session.destroy((err) => {
        if(err){
            req.flash("error","Error logging out");
            return res.redirect("/");
        }
        res.redirect("/login");
    });
});

router.get("/",isLoggedIn,homeController)

router.get("/chat/:id",isLoggedIn,chatController)

router.get("/getall",getAllUsers)

router.post("/signup",signupController);
router.post("/login",loginController);

module.exports = router;