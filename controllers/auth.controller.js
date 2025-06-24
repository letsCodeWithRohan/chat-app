const connection = require("../config/db")
const bcrypt = require("bcryptjs");

const signupController = async (req,res) => {
    const { username, email, password, gender,fullname } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    connection.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err, results) => { 
        if (err) {
            req.flash("error","Error checking existing users");
            return res.redirect("/signup");
        }
        if (results.length > 0) {
            req.flash("error","Username or email already exists");
            return res.redirect("/signup");
        }
        connection.query("INSERT INTO users (username, email, password, gender, fullname,profile_image) VALUES (?, ?, ?, ? ,?, ?)", [username, email, hashedPassword, gender, fullname,`https://api.dicebear.com/9.x/initials/svg?seed=${fullname.replace(" ","+")}`], (err, results) => {
            if (err) {
                req.flash("error","Error inserting data");
                return res.redirect("/signup");
            }
            req.flash("success","Successfully Signup")
            res.redirect("/login");
        });
    })
}

const loginController = (req, res) => {
    const { email, password } = req.body;
    connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            req.flash("error","Error fetching user data");
            res.redirect("/login");
            return;
        }
        if (results.length === 0) {
            req.flash("error","Email not found");
            res.redirect("/login");
            return;
        }
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            req.flash("error","Invalid password");
            res.redirect("/login");
            return;
        }
        req.session.user = {
            id: user.id,
            username: user.username,
            gender: user.gender,
            email: user.email,
            fullname: user.fullname,
            profile_image: user.profile_image,
            bio: user.bio
        };
        res.redirect("/");
    });
}

const getAllUsers = (req,res) => {
    connection.query("SELECT * FROM users",(err,results) => {
        if(err){
            return res.send(`Error : ${err.message}`)
        }
        res.send(results)
    })
}

const homeController = async (req,res) => {
    connection.query("SELECT * FROM users WHERE NOT id = ? ",[req.session.user.id], (err, results) => {
        if (err) {
            return res.send(`Error : ${err.message}`);
        }
        res.render("index", { users: results, user:req.session.user });
    });
}

const chatController = async (req,res) => {
    users = []
    connection.query("SELECT * FROM users WHERE NOT id = ? ",[req.session.user.id], (err, results) => {
        if (err) {
            return res.send(`Error : ${err.message}`);
        }
        users = results 
    });
    connection.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, results) => {
        if (err) {
            return res.send(`Error : ${err.message}`);
        }
        if (results.length === 0) {
            return res.send("User not found");
        }
        let chatUser = results[0];
        res.render("chat",{ 
            loggedInUser : req.session.user,
            user: chatUser,
            users
        })
    });
}

module.exports = {
    signupController,
    loginController,
    getAllUsers,
    homeController,
    chatController
}