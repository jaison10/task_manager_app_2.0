const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
    name : 'jaison',
    email : 'jaison@xyz.com',
    password: 'jai12asdfghj'
}

beforeEach(async ()=>{
    await User.deleteMany()
    await new User(userOne).save()
})


test('Sign up new user', async()=>{
    await request(app).post('/users').send({
        name : 'jaison',
        email : 'jaisonj1010@gmail.com',
        password : 'jaison123new@'
    }).expect(201)  
})

test('Should login existing user', async()=>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})