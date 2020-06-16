const express =  require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = express.Router()


router.post('/tasks',auth, async(req, res)=>{
    
    const task = new Task({
        ...req.body,       // ... is BS6 operator. Copies all the properties of the body to this object. 
        owner : req.user._id      // we get the owner from auth.
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(500).send(e)
    }

    // new_task.save().then(()=>{
    //     res.status(201).send(new_task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

// FILTERING: GET  /tasks?complete=false
// pagination: limil and skip     // pagination is limitting the amount of results displayed in a page.
// GET /tasks?limit=10&skip=10         // skip lets you display from first itself or skip few and dispaly there onwards.
// GET /tasks?sortBy=createdAt:asc 
router.get('/tasks',auth, async(req, res)=>{

    const match = {}
    if(req.query.complete){
        match.complete = req.query.complete === 'true'  // doing ==='true' because we want boolean value to be stored.
    }
    
    const sort = {}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')  // spilitting at ':'. We want whats there on RHS of ':'.
        sort[parts[0]] = parts[1] === 'asc'? 1 : -1  // parts[0] contains LHS of ':'. Example: createdAt. We are setting value for createdAt from RHS of ':'
    }

    try{
        // const tasks = await Task.find({ owner: req.user._id})   // here we are going to tasks and comparing user id of tasks with logged in user's id.
        // res.status(202).send(tasks)       

        // O R 
// here we are listing tasks of logged in user using virtual db of tasks in user.
        await req.user.populate({
            path:'tasks',
            match:match,
            options:{
                limit: parseInt(req.query.limit) ,             // limitting no. of tasks displayed in a page.
                skip: parseInt(req.query.skip) ,
                sort:sort                  
            }
        }).execPopulate()   
        res.status(202).send(req.user.tasks)
    } catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id',auth, async(req, res)=>{
    const _id = req.params.id

    try{
        const task = await Task.findOne({_id, owner:req.user._id})  // owner is for filtering by user.

        if(!task){
            res.send(404).send()
        }
        res.status(202).send(task)
    } catch(e){
        res.status(500).send()
    }
})                        


router.patch('/tasks/:id',auth, async(req, res)=>{                                   // for updating.

    //below code is to check if the user is trying to update the propoerty which actually exists in database.
    const updates_from_user = Object.keys(req.body)  // creates an array of properties user wants to update.
    const allowedUpdates_developer = ['description','complete']  //specifying which and all possible to update.
   
    // checking if each and every user's updates property exists in allowed array.
    const isValidOperation = updates_from_user.every((update)=> allowedUpdates_developer.includes(update))
    
    if(!isValidOperation){
        return res.status(404).send({error:`Invalid update property buddy!`})
    }

    try{
        const task = await Task.findOne({ _id: req.params.id ,  owner: req.user._id})

        if(!task){
            return res.status(404).send('Sorry, you\'re not authorized to do this!')
        }

        updates_from_user.forEach((update)=>{
            task[update] = req.body[update] 
        })

        await task.save()

        res.status(200).send(task)
    } catch(e){
        res.status(500).send(e)
    }
}) 

router.delete('/tasks/:id', auth, async(req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send('Either task not found or you\'re not allowed to do this!')
        }

        res.status(200).send({deleted_task : task})
    }catch(e){
        res.status(500).send(e)
    }
})


module.exports = router