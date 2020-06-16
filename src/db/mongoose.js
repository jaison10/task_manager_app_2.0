const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_CONNECTION_URL,{
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify: false
})



//mongod.exe --dbpath="F:\program files\Mongodb\mongodb-data"