const app = require('./app')

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log('App is listening to the port-', PORT)
})


// // testing of hash
// const bcrypt =  require('bcryptjs')

// const test = async()=>{
//     const password = 'Jaison10'
//     const hashPassword = await bcrypt.hash(password, 8)

//     const isMatch = await bcrypt.compare('Jaison10', hashPassword)
//     // console.log(isMatch)
// }

// test()

// // testing of webtoken

// const jwt = require('jsonwebtoken')

// const myFuntion = async()=>{
//     const token = jwt.sign({_id:'Jaison10@'}, 'hackmeifucan', {expiresIn: '5d'})
//     console.log('token is:', token)

//     const data_back = jwt.verify(token, 'hackmeifucan')
//     console.log(data_back) 
// }

// myFuntion()

// // file uploading using MULTER try

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',       // destination folder.
//     limits:{
//         fileSize: 1000000   // 1mb
//     },
//     fileFilter(req, file, cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload Word document!'))
//         }
        
//         cb(undefined, true)

//         // cb(new Error('File must be pdf!'))
//         // cb(undefined, false)
//         // cb(undefined, true)
//     }
// })

// app.post('/upload', upload.single('upload') , (req, res)=>{  // single is the middleware.
//     res.send()
// },(error, req, res, next)=>{   // customising errors.
//     res.status(400).send({ error: error.message })
// })

//mongod.exe --dbpath="F:\program files\Mongodb\mongodb-data"