const calculateTip = (final, tipPercent)=>final + (final * tipPercent)

const add = (a,b)=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            if(a<0 || b<0){
                return reject('The number cannot be negative buddy!')
            }

            resolve(a+b)
        }, 3000)
    })
}

module.exports = {
    calculateTip,
    add
}
