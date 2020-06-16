const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeMessage, sendLeaveMessage } = require('../emails/account')

// ROUTER

const router = new express.Router()

router.post('/users/checkAccounts', async (req, res)=>{
    try{
        const user = await User.find({})
        res.status(200).send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

router.post('/users', async (req, res)=>{
    
    const user = new User(req.body)

    try{
        const token = await user.generateAuthToken()
        await user.save()          
        
        sendWelcomeMessage(user.email, user.name) // sending to the function in accounts file.
        res.status(201).send({user, token})
    } catch(e){
        res.status(500).send(e)
    }

    // an_unser.save().then(()=>{
    //     res.status(201).send(an_unser)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

router.post('/users/login', async(req, res)=>{
    try{
        // the below code goes to model/user's userSchema.statics.findByCredentials()
        const user = await User.findByCredentials(req.body.email, req.body.password)  // user defined function. 
        const token = await user.generateAuthToken(user)  // working on single user. This calls function in models
        
        res.send({user , token})  // this is how u send multiple items to the client

    }catch(e){
        res.status(400).send({"Logging in failed!":e})
    }   
})

router.post('/users/logout', auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token     // req.token is received from auth. Thats the token the account logged in with
        })                           // in above code,  guess we are removing the token the person logged in with from the list of tokens.

        await req.user.save()

        res.send('Logged out successfully!')
    } catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch(e){
        res.status(500).send(e)
    }
})


router.get('/users/me', auth ,async (req, res)=>{  // auth file runs and if it calls next() then only rest item runs.

    res.status(202).send(req.user)    // receiving from auth.js 
    
})


router.patch('/users/me', auth, async(req, res)=>{                                   // for updating.

    //below code is to check if the user is trying to update the propoerty which actually exists in database.
    const updates_from_user = Object.keys(req.body)  // creates an array of properties user wants to update.
    const allowedUpdates_developer = ['name','email','password','age']  //specifying which and all possible to update.
   
    // checking if each and every user's updates property exists in allowed array.
    const isValidOperation = updates_from_user.every((update)=> allowedUpdates_developer.includes(update))
    
    if(!isValidOperation){
        return res.status(404).send({error:`Invalid update property buddy!`})
    }

    try{
        // this 3 line instead one is to make middleware run. Only for 'save', middleware runs. 
        const user = req.user   // getting user from auth.(req.user)

        updates_from_user.forEach((update)=>user[update] = req.body[update])  
        
        await user.save()

        //const user= await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})

        res.status(200).send({"Updated successfully!":user})
    } catch(e){
        res.status(500).send(e)
    }
})


router.delete('/users/me', auth, async(req, res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send({error:"User not found!"}) //this wud work only if you pass 24byte id.(24 total chars).If less, catch() will be executed.
        // }

        await req.user.remove()

        sendLeaveMessage(req.user.email, req.user.name)  // sending data to the function in account file which wud send an email when the user deletes account.
        res.status(200).send({"Deleted user: ":req.user})
    } catch(e){
        res.status(500).send(e)
    }   
})

// multer for uploading file. 
const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, db){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return db(new Error('Upload an image!'))
        }
        db(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{ // the value inside single() has to be given as key in postman.
    // resizing and converting as png and storing binary of that new file.
    const buffer = await sharp( req.file.buffer ).resize({ width:250, height:250 }).png().toBuffer()
     
    req.user.avatar = buffer   
    await req.user.save()
    res.send('Profile picture has been uploaded!')
}, (error, req, res, next)=>{
    res.status(400).send({ error: error.message }) // this sends an error message as object instead of html.
})

router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send('Profile photo removed successfully!')
})

router.get('/users/:id/avatar', async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error('User not found or Profile picture is not found!')
        }

        res.set('Content-type', 'image/png')  // converts into an image. Saving it to png (did above in post) is actually helping here. All images will be png itself right.
        res.send(user.avatar)
    } catch(e){
        res.status(404).send(e)
    }
})
module.exports = router