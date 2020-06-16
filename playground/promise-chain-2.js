require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5ed767e9285e7915bc4271c6').then((task)=>{
//     if(!task){
//         console.log('User not found to delete!')
//     }

//     return Task.countDocuments({complete: false})
// }).then((count)=>{
//     console.log(`There are ${count} incompleted tasks!`)
// }).catch((e)=>{
//     console.log('Got an error!')
// })


// ABOVE CODE CAN BE WRITTEN WITH ASYNC AND AWAIT AS FOLLOWS.


const DeleteAndCount = async(id)=>{
    const del = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({complete: false})
    return count
}

DeleteAndCount('5ed37e44a7299d30d089035f').then((count)=>{   //calling DeleteAndCount function passing id. That function returns count.
    console.log(' Incomplete tasks are: ', count)
}).catch((e)=>{
    console.log('ERROR:', e)
})

