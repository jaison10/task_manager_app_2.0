const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')  // replace here used to remove 'Bearer' part. 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({_id: decoded._id, 'tokens.token': token}) // find user with id which is similar to the one found on decoding the token since the token is made up of id. And check if that user has token active(check if he logged in and if its active.)

        if(!user){
            throw new Error
        }

        req.token = token  // this will b the token used to login.
        req.user = user  // because i dont want that post function to search for user again. 
        next()
    } catch(e){
        res.status(401).send({ error: 'Please Authorize!'})
    }
}

module.exports = auth