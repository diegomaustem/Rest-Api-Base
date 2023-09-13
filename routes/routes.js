var express = require("express")
var app = express()
var router = express.Router()
var HomeController = require("../controllers/HomeController")
var UserController = require("../controllers/UserController")
var AdminAuth = require("../middleware/AdminAuth")

router.get('/', HomeController.index)
router.get('/users',AdminAuth,UserController.index)
router.get('/user/:id',AdminAuth,UserController.findUser)
router.post('/user',AdminAuth,UserController.create)
router.put('/user',AdminAuth,UserController.edit)
router.delete('/user/:id',AdminAuth,UserController.remove)

router.post('/recoverpassword', UserController.recoverPassword)
router.post('/changepassword', UserController.changePassword)

router.post('/login', UserController.login)

module.exports = router