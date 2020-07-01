// this file is for testing sake.
// This file comes before index. Creating express app is done here.

const express = require('express')
require('./db/mongoose')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

const app = express()

app.use(express.json())
app.use(UserRouter)                       // this makes the router available on browser.
app.use(TaskRouter)

module.exports = app

//mongod.exe --dbpath="F:\program files\Mongodb\mongodb-data"