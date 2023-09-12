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
}

module.exports = new PasswordToken()