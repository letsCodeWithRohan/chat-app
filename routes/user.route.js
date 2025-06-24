const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/middleware');
const multer = require("multer")
const upload = multer({ dest: 'public/images/uploads/' })

const { profileChangeController } = require('../controllers/user.controller');

router.post('/change-profile', isLoggedIn, upload.single('profile') ,profileChangeController);

module.exports = router;