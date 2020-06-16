//CRUD- Create Read Update Delete.

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const {MongoClient, ObjectID} = require('mongodb')    // short hand instead of the above. JS rocks.

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectID()
// console.log(id.id.length)                    // id is actually a binary data
// console.log(id.getTimestamp())     
// console.log(id.toHexString().length)         // converting to hexa data

MongoClient.connect(connectionURL, { useNewUrlParser: true },  (error, client)=>{
    if(error){
        return console.log('Unable to connect to the database!')
    }

    const db=client.db(databaseName)          //create database

// I N S E R T I O N    P A R T

    // db.collection('users').insertMany([{         // insert                            
    //     name:'YOO',
    //     age:20
    // },{
    //     name:'ZOO',
    //     age: 22
    // }], (error, result)=>{                        // callback function
    //     if(error){
    //         console.log("Unable to insert!")
    //     }
    //     console.log(result.ops)                  // ops: array of documents
    // })

    // db.collection('tasks').insertMany([{
    //     description: 'Submit UX assignment',
    //     complete: false
    // },{
    //     description:'Finish Nodejs course',
    //     complete: false
    // },{
    //     description: 'Submit observe problem and submit',
    //     complete:true
    // }], (error, result)=>{
    //     if(error){
    //         console.log("Unable to insert!!")
    //     }
    //     console.log(result.ops)
    // })

// F E T C H I N G   P A R T

    //  db.collection('users').findOne({ name:'Jaison'}, (error, result)=>{   // query and callback function.
    //     if(error){
    //        return console.log('Couldn\'t fetch the item')   // not getting searched item is not an ERROR.
    //     }
    //     console.log(result)
    //  })

     //  db.collection('users').findOne({ _id:new ObjectID('5ed0d00991ef240ca041bbcc')}, (error, result)=>{   // query and callback function.
    //     if(error){
    //        return console.log('Couldn\'t fetch the item')   // not getting searched item is not an ERROR.
    //     }
    //     console.log(result)
    //  })

     db.collection('users').find({ name: 'Jaison' }).count((error, user)=> {
        if(error){
            return console.log('Unable to fetch!')
        }
        console.log(user)
     })

     db.collection('tasks').find({ complete: false }).toArray((error, tasks)=> {
        if(error){
            return console.log('Unable to fetch!')
        }
        console.log(tasks)
     })

// U P D A T E

//      db.collection('users').updateOne({
//           _id: new ObjectID("5ed0d00991ef240ca041bbcc")},
//         {
//             $set:{
//                 name: 'Jaison DSouza'
//             }
//         }).then((result)=>{
//             console.log(result)
//         }).catch((error)=>{
//             console.log(error)
//         })
// 

     db.collection('tasks').updateMany({
         complete: false
     },{
         $set:{
             complete: true
         }
     }).then((res)=>{
         console.log(res.modifiedCount)
     }).catch((error)=>{
         console.log(error)
     })

// D E L E T E

     db.collection('users').deleteMany({
         name: 'YOO'
     }).then((res)=>{
        console.log(res)
     }).catch((error)=>{
        console.log(error)
     })


     db.collection('tasks').deleteOne({
         _id: new ObjectID("5ed134311ea4b020801d6a91")
     }).then((res)=>{
         console.log(res)
     }).catch((error)=>{
         console.log(error)
     })

})
//mongod.exe --dbpath="F:\program files\Mongodb\mongodb-data"