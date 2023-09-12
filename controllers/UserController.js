const knex = require("../database/connection")
var User = require("../models/User")
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

        if(email == undefined) {
            res.status(403)
            res.json({err: "O e-mail é inválido!"})
            return 
        }

        let emailExists =  await User.findEmail(email)

        if(emailExists) {
            res.status(406) 
            res.json({err: "O e-mail já está cadastrado!"})
            return 
        }

        await User.new(email, password, name)

        res.status(200)
        res.send("Sucesso!")
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
}

module.exports = new UserController();