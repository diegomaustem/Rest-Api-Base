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
}

module.exports = new UserController();