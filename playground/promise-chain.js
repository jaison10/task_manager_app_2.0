require('../src/db/mongoose')
const User = require('../src/models/user')


// User.findByIdAndUpdate('5ed75627731eae2650edb85b', {age: 1}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:1})
// }).then((count)=>{
//     console.log(`There exists ${count} user(s)`)
// }).catch((e)=>{
//     console.log(e)
// })

// The above code can be modified into simpler one using async and await.

const UpdateAndCount = async(id, age)=>{
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({age})
    return count
}

UpdateAndCount('5ed75627731eae2650edb85b', 56).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})
