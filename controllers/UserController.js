const knex = require("../database/connection")
var User = require("../models/User")
var PasswordToken = require("../models/PasswordToken")
var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")

var secret = "cd7b32a268cae54174facdccac34db519cf6aba5d1ab71918a021de65f69ec4c"
class UserController {
    async index(req, res) {
        let users = await User.findAll()
        res.json(users)
    }

    async findUser(req, res) {
        let id = req.params.id
        let user = await User.findById(id)

        if(user == undefined) {
            res.status(404)
            res.json({})
        }else{
            res.status(200)
            res.json(user)
        }
    }

    async create(req, res) {
        let {email, name, password} = req.body

        let emailExists =  await User.findEmail(email)

        if(emailExists === true) {
            res.status(406) 
            res.json({err: "O e-mail já está cadastrado!"})
            return 
        } else {
            if((email != undefined) && (password != undefined) && (name != undefined)) {
                await User.new(email, password, name)
                res.status(200)
                res.send("Usuário cadastrado com sucesso!")
            }else{
                res.status(406) 
                res.json({err: "Verifique se todos os campos foram preenchidos!"})
                return 
            }
        }
    }

    async edit(req, res) {
        let {id, name, role, email} = req.body
        let result = await User.update(id, email, name, role)

        if(result != undefined) {
            if(result.status) {
                res.status(200)
                res.send("Ok")
            }else{
                res.status(406)
                res.send(result.err)
            }
        }else{
            res.status(406)
            res.send("Ocorreu um erro no servidor!")
        }
    }

    async remove(req, res) {
        let id = req.params.id

        let result = await User.delete(id)

        if(result.status) {
            res.status(200)
            res.send("Success")
        }else{
            res.status(406)
            res.send(result.err)
        }
    }

    async recoverPassword(req, res) {
        let email = req.body.email 
        let result = await PasswordToken.create(email)
        if(result.status) {
            res.status(200)
            res.send("" + result.token)
        }else{
            res.status(406)
            res.send(result.err)
        }
    }

    async changePassword(req, res) {
        let token = req.body.token
        let password = req.body.password
        let isTokenValid = await PasswordToken.validade(token)

        if(isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200)
            res.send("Senha alterada!")
        }else{
            res.status(406)
            res.send("Token Inválido!")
        }
    }

    async login(req, res) {

       
    }
}

module.exports = new UserController();