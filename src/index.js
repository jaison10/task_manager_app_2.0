const express = require('express')
require('./db/mongoose')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

const app = express()

const PORT = process.env.PORT

//middleware testing:

// app.use((req, res, next)=>{
//     // console.log(req.method, req.path)
//     // next()                              // won't give outpur until you call this. It will always be 

//     if(req.method === 'GET'){
//         res.status(503).send('Server is down! GET requests are disabled buddy!') 
//     } else{
//         next()
//     }
// })


app.use(express.json())

// R O U T E R

app.use(UserRouter)                       // this makes the router available on browser.
app.use(TaskRouter)

// ROUTER   E N D

app.listen(PORT, ()=>{
    console.log('App is listening to the port-', PORT)
})

// testing of hash
const bcrypt =  require('bcryptjs')

const test = async()=>{
    const password = 'Jaison10'
    const hashPassword = await bcrypt.hash(password, 8)

    // console.log(password)
    // console.log(hashPassword)

    const isMatch = await bcrypt.compare('Jaison10', hashPassword)
    // console.log(isMatch)
}

test()

// testing of webtoken

const jwt = require('jsonwebtoken')

const myFuntion = async()=>{
    const token = jwt.sign({_id:'Jaison10@'}, 'hackmeifucan', {expiresIn: '5d'})
    console.log('token is:', token)

    const data_back = jwt.verify(token, 'hackmeifucan')
    console.log(data_back) 
}

myFuntion()

// file uploading using MULTER try

const multer = require('multer')
const upload = multer({
    dest: 'images',       // destination folder.
    limits:{
        fileSize: 1000000   // 1mb
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload Word document!'))
        }
        
        cb(undefined, true)

        // cb(new Error('File must be pdf!'))
        // cb(undefined, false)
        // cb(undefined, true)
    }
})

app.post('/upload', upload.single('upload') , (req, res)=>{  // single is the middleware.
    res.send()
},(error, req, res, next)=>{   // customising errors.
    res.status(400).send({ error: error.message })
})


//mongod.exe --dbpath="F:\program files\Mongodb\mongodb-data"