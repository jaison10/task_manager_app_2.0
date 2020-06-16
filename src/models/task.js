const mongoose = require('mongoose')
const validator = require('validator')
require('../db/mongoose')

const taskSchema = new mongoose.Schema({  // converts uppercase Tasks into lowercase. Even if u give "Task", it will be saved as "tasks". 's' will be added
description:{
    type: String,
    trim: true,
    required: [true, ' Description is required, buddy!']
},
complete:{
    type: Boolean,
    default: false
},
owner:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'     // this is used to refer to other model. 
}

},{
    timestamps: true
})

const Task = mongoose.model('Tasks', taskSchema)


module.exports= Task