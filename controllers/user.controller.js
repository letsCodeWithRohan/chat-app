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
        connection.query("UPDATE users SET profile_image = ? WHERE id = ? ",[newPath.replace("public",""),req.body.id],(err,results) => {
            if(err){
                console.log(err.message);
                return res.redirect("/profile")
            }
            req.session.user.profile_image = newPath.replace("public","");
            return res.redirect("/profile")
        })
    })
}

module.exports = {
    profileChangeController
}