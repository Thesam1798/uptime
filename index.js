const ping = require('ping')
const sleep = require('sleep-promise')
const fs = require('fs')
require('colors')

const hosts = ['127.0.0.1', '8.8.8.8', '193.26.21.71']

const separator = '-------------------------------------------------------'
const voidSeparator = '                                                       '
let path
let start
let fileContents

function getTime() {
    let date_ob = new Date()
    let hours = date_ob.getHours()
    let minutes = date_ob.getMinutes()
    let seconds = date_ob.getSeconds()
    return hours + ":" + minutes + ":" + seconds
}

function getDay() {
    let date_ob = new Date()
    let date = ("0" + date_ob.getDate()).slice(-2)
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
    let year = date_ob.getFullYear()
    return date + "-" + month + "-" + year
}

function getDateTime() {
    return getDay() + " | " + getTime()
}

function testNetwork() {

    if (path !== ('./' + getDay() + '.log')) {
        path = './' + getDay() + '.log'
        if (fs.existsSync(path)) {
            fileContents = fs.readFileSync(path).toString()
        } else {
            fileContents = ""
        }
    }

    sleep(1000).then(function () {
        hosts.forEach(function (host) {
            start = process.hrtime()
            ping.sys.probe(host, function (isAlive) {
                console.log(isAlive)
                if (!isAlive) {
                    const elapsed = process.hrtime(start)[1] / 1000000
                    const msg = '[' + getDateTime() + '] ' + host + " | " + elapsed.toFixed(3) + "ms"
                    console.log(msg)
                    fileContents = fileContents + '\n' + msg
                    fs.writeFileSync(path, fileContents)
                }
            })
        })
        testNetwork()
    })
}

console.log("logged !")
console.log(voidSeparator)
console.log(separator.dim)
console.log("                    Up Time Monitor                    ")
console.log("                       <Éclosia>                       ")
console.log(separator.dim)
console.log(voidSeparator)

testNetwork()
