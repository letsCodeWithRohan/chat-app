const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/middleware');
const multer = require("multer")
const upload = multer({ dest: 'public/images/uploads/' })

const { profileChangeController, editProfileController } = require('../controllers/user.controller');

router.post('/change-profile', isLoggedIn, upload.single('profile') ,profileChangeController);

router.post('/edit-profile',isLoggedIn,editProfileController)

module.exports = router;