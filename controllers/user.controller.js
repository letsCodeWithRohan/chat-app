const fs = require("fs")
const path = require("path");
const connection = require("../config/db");

const profileChangeController = async (req, res) => {
    const ext = path.extname(req.file.originalname);
    const oldPath = req.file.path;
    const newPath = path.join(req.file.destination, req.file.filename + ext);

    // Rename file to include extension
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error("Rename error:", err);
            return res.redirect("/profile");
        }
        connection.query("UPDATE users SET profile_image = ? WHERE id = ? ", [newPath.replace("public", ""), req.body.id], (err, results) => {
            if (err) {
                console.log(err.message);
                return res.redirect("/profile")
            }
            req.session.user.profile_image = newPath.replace("public", "");
            return res.redirect("/profile")
        })
    })
}

const saveChatInDB = (senderId, receiverId, message) => {
    connection.query("INSERT INTO messages (sender_id,receiver_id,message) VALUES (?,?,?)", [senderId, receiverId, message], (err, result) => {
        if (err) {
            console.log(err)
        }
        return;
    })
}

const chatController = async (req, res) => {
    let users = []
    let messages = []
    connection.query("SELECT * FROM users WHERE NOT id = ? ", [req.session.user.id], (err, results) => {
        if (err) {
            return res.send(`Error : ${err.message}`);
        }
        users = results
    });
    connection.query("SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY time", [req.params.id, req.session.user.id, req.session.user.id, req.params.id], (err, result) => {
        if (err) {
            return res.send(`Error : ${err.message}`);
        }
        messages = result
    });
    connection.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, results) => {
        if (err) {
            return res.send(`Error : ${err.message}`);
        }
        if (results.length === 0) {
            return res.send("User not found");
        }
        let chatUser = results[0];
        res.render("chat", {
            loggedInUser: req.session.user,
            user: chatUser,
            users,
            messages
        })
    });
}

const editProfileController = (req,res) => {
    const {fullname,username,bio,gender} = req.body;
    const loggedInUser = req.session.user;
    if(!fullname || !username || !bio){
        res.send("Please fill all the fields");
    }else{
        // Here I have not handles the username already exists or not
        connection.query("UPDATE users SET fullname = ?, username = ?, bio = ?, gender = ? WHERE id = ?", [fullname, username,bio,gender,loggedInUser.id],(err,result) => {
            if(err){
                return res.send("Error : ",err)
            }
            loggedInUser.username = username;
            loggedInUser.fullname = fullname;
            loggedInUser.bio = bio;
            loggedInUser.gender = gender;
            res.redirect("/profile")
        })
    }
}

module.exports = {
    profileChangeController,
    saveChatInDB,
    chatController,
    editProfileController
}