var knex = require("../database/connection")
var bcrypt = require("bcrypt")
const PasswordToken = require("./PasswordToken")

class User {

    async findAll() {
        try{
            let result = await knex.select(["id", "name", "email", "role"]).table("users")
            return result
        }catch(err){
            console.log(err)
            return []
        }
    }

    async findById(id) {
        try{
            let result = await knex.select(["id", "name", "email", "role"]).where({id: id}).table("users")

            if(result.length > 0) {
                return result[0]
            }else{
                return undefined
            }
        }catch(err){
            console.log(err)
            return []
        }
    }

    async new(email, password, name) {
        try{
            let hash = await bcrypt.hash(password, 10)
            await knex.insert({email, password: hash, name, role: 0}).table("users")
        }catch(err){
            console.log(err)
        }
    }

    async findEmail(email) {
        try{
            let result = await knex.select("*").from("users").where({email: email})
            
            if(result.length > 0) {
                return true
            }else{
                return false
            }
        }catch(err){
            console.log(err)
            return false
        }
    }

    async edit(email) {
        try{
            let result = await knex.select("*").from("users").where({email: email})
            
            if(result.length > 0) {
                return true
            }else{
                return false
            }
        }catch(err){
            console.log(err)
            return false
        }
    }

    async update(id, email, name, role) {
        var user = await this.findById(id)

        if(user != undefined) {
            let editUser = {}

            if(email != undefined) {
                let result = await this.findEmail(email)
                if(result == false) {
                    editUser.email = email
                }else{
                    return {status: false,err: "O e-mail já está cadastrado!"}
                }
            }

            if(name != undefined) {
                editUser.name = name
            }

            if(role != undefined) {
                editUser.role = role
            }

            try{
                await knex.update(editUser).where({id: id}).table("users")
                return {status: true}
            }catch(err){
                return {status: false,err: err}
            }

        }else{
            return {status: false,err: "Usuário inexistente!"}
        }
    }

    async delete(id) {
        let user = await this.findById(id)

        if(user != undefined) {
            try{
                await knex.delete().where({id: id}).table("users")
                return {status: true}
            }catch(err){
                return {status: false,err: err}
            }
        }else{
            return {status: false,err: "Erro! Operação não realizada!"}
        }
    }

    async changePassword(newPassword, id, token) {
        let hash = await bcrypt.hash(newPassword, 10)
        await knex.update({password: hash}).where({id: id}).table("users")
        await PasswordToken.setUsed(token)
    }
}

module.exports = new User();