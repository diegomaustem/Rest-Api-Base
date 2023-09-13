var knex = require("../database/connection")
var User = require("./User")

class PasswordToken {
    
    async create(email) {
        let user = await knex.select("*").from("users").where({email: email})
        if(user != undefined) {
            try{
                let token = Date.now()
                await knex.insert({
                    user_id: user[0].id,
                    used: 0,
                    token: token
                }).table("passwordtokens")
                return {status: true, token: token}
            }catch(err){
                console.log(err)
                return {status: false, err: err}
            }
        }else{
            return {status: false, err: "E-mail inexistente!"}
        }
    }

    async validade(token) {
        try{
            let result = await knex.select().where({token: token}).table("passwordtokens")

            if(result.length > 0) {
                let tk = result[0]
                if(tk.used ) {
                    return {status: false}
                }else{
                    return {status: true, token: tk}
                }
            }else{
                return {status: false}
            }
        }catch(err){
            console.log(err)
            return {status: false}
        }
    }

    async setUsed(token) {
        await knex.update({used: 1}).where({token: token}).table("passwordtokens")
    }
}

module.exports = new PasswordToken()