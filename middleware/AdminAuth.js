var jwt = require("jsonwebtoken")
var secret = "cd7b32a268cae54174facdccac34db519cf6aba5d1ab71918a021de65f69ec4c"

module.exports = function(req, res, next) {
    const authToken = req.headers['authorization']

    if(authToken != undefined) {
        const bearer = authToken.split(' ')
        let token = bearer[1]

        try {
            let decoded = jwt.verify(token, secret)

            if(decoded.role == 1) {
                next()
            }else{
                res.status(403)
                res.send("Permissão insuficiente!")
                return 
            }
        }catch(err){
            res.status(403)
            res.send("Você não está autenticado!")
            return 
        }
        
    }else{
        res.status(403)
        res.send("Você não está autenticado!")
        return 
    }
}