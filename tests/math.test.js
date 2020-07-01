const { calculateTip, add } = require('../src/math')

test('Calculate tip', ()=>{
    const value = calculateTip(10, 0.3)
    expect(value).toBe(13)
}) 

// ASYNCHRONOUS 

// test('Async test', (done)=>{
//     setTimeout(()=>{
//         expect(1).toBe(2)
//         done()                   // calling this way needed in order to execute expect() properly.
//     }, 2000)   
// })

// test('Sum of 2 no.s',(done)=>{
//     add(2, 3).then((sum)=>{
//         expect(sum).toBe(5)
//         done()
//     })
// })

// //  async | await

// test('Async await test',async()=>{
//     const sum = await add(10, 20)
//     expect(sum).toBe(30)
// })
// async await better syntax. Needn't use done() and all.

