const sleep = require('sleep-promise')
const fs = require('fs')
const https = require('https')

require('colors')

const url = 'liberty-host.com'

const separator = '-------------------------------------------------------'
const voidSeparator = '                                                       '
let path
let fileContents
let onError = false

const options = {
    hostname: url,
    port: 443,
    path: '',
    method: 'GET'
}

let start = process.hrtime()

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

function update(localPath, error) {
    if (onError === false && error === true) {
        start = process.hrtime()
        onError = true
        console.log('Un down time a été déclencher : ' + getDateTime())
    } else if (onError === true && error === false) {
        if (process.hrtime(start)[0] >= 5) {
            fileContents += '\n' + '[' + getDateTime() + '] ' + process.hrtime(start)[0] + ' seconde'
            fs.writeFileSync(localPath, fileContents)
        }
        console.log('[' + getDateTime() + '] Impossible de contacté : ' + url + '\nPendant une période de : ' + process.hrtime(start)[0] + 'seconde')
        onError = false;
        start = process.hrtime()
    }
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
        const req = https.request(options, res => {
            if (res.statusCode !== 301) {
                update(path, true)
            } else {
                update(path, false)
            }
        })

        req.on('error', () => {
            update(path, true)
        })

        req.end()

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
