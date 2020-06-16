const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt =  require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({    // entire model is a Scheman now. 
    name:{                            
        type: String,
        required: true, 
        trim: true                
    },
    age:{
        type: Number,
        default: 18,        // default value. It cant be 0 because there is a condition tht it shud be 18+
        validate(value){
            if(value<0){      // this checks if negative. This will be performed first. 
                throw new Error('Age cannot be negative number buddy!')
            }
        },
        min:[18, 'You are not allowed buddy! Grow up!']   // this checks if its 18 or 18+
    },
    email:{
        type:String,
        unique: true,
        required: true,
        trim: true,             // removes spaces if its there in the beggining and end. 
        lowercase: true,         // convers into lowercase.
            // validate() an in-built function lets u perform any validation other than provided by mongoose validation.
        validate(value){    
           if(!validator.isEmail(value)){                 // validator is from npm package.
                throw new Error('Invalid email buddy!!')
            }
        }
    },
    password:{
        type: String,
        // required: [true, 'Password is required buddy! '],   // this or the validator.isEmpty()
        trim: true,
        // minlength: [7,'Can you keep a password with length more than 7, buddy?'],     //even this would work or inside validate one.
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Password cannot be empty buddy!')
            }
            if(value.toLowerCase().includes('password')){
               throw new Error('Password contains "password" buddy! Try something by your own!') 
            }
            if(!validator.isByteLength(value,{min:7})){
                throw new Error('Password cannt have length less than 7,buddy!')
            }
        }   
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer   //lets us store binary data.
    }
},{
    timestamps: true
})

// this is a RELATIONSHIP.
userSchema.virtual('tasks', {      // this is the link to the Task collection but virtual. Won't be stored in db.
    ref: 'Tasks',
    localField:'_id',         // here for user _id is the local field
    foreignField:'owner'     // and curresponding foreignfield is taken from tasks. Task's owner stores the id of the user.
})


userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()   // converts into object which is editable
    
    delete userObject.password        // password wont be shown.
    delete userObject.tokens         // tokens won't be shown as well.
    delete userObject.avatar        // the binary data won't be shown while reading data. But it will be displayed in browser. 

    return userObject
}

// methods are accessible as instincs 
userSchema.methods.generateAuthToken = async function(){
    const user = this                  // in router, we are already working on single user.

    const token = jwt.sign({_id: user._id.toString() } , process.env.JWT_SECRET) // creating token using id as reference. 
    // storing in tokens array
    user.tokens = user.tokens.concat({ token:token })
    await user.save()

    return token
}   

// statics are accessible at models
userSchema.statics.findByCredentials = async(email, password)=>{
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Wrong password!')
    }

    return user
}

// hash the plain text password before saving.

// save: https://mongoosejs.com/docs/api/model.html#model_Model-save
// save is one of a middleware like save, validate, remove etc.
userSchema.pre('save', async function(next){   // pre - want to do before saving(save).
    const user =  this                  
    console.log('Before saving')


    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    

    next()    // when one user is done. Or else it will hang in forever.
})


// delete tasks when the user is deleted.
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({ owner: user._id })
    
    next()
})


const User = mongoose.model('User', userSchema)  // passing that Schema here.


module.exports= User