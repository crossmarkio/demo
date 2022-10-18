const directory = require('./directory.json')

let page = "Landing"

let file = directory.map((obj) => {
    if(Object.keys(obj)[0] == page) return obj
}).filter(Boolean)[0]

console.log(file[page])

let element = require(file)

console.log(element)