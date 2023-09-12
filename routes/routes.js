var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController")

router.get('/', HomeController.index)
router.get('/users', UserController.index)
router.get('/user/:id', UserController.findUser)
router.post('/user', UserController.create)
router.put('/user', UserController.edit)
router.delete('/user/:id', UserController.remove)

router.post('/recoverpassword', UserController.recoverPassword)
router.post('/changepassword', UserController.changePassword)

module.exports = router;