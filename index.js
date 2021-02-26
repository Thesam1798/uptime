const ping = require('ping');
const sleep = require('sleep-promise');
require('colors');

const hosts = ['127.0.0.1', '8.8.8.8', '193.26.21.71'];

const separator = '-------------------------------------------------------';
const voidSeparator = '                                                       ';

console.log("logged !");
console.log(voidSeparator);
console.log(separator.dim);
console.log("                    Up Time Monitor                    ")
console.log("                       <Éclosia>                       ")
console.log(separator.dim);
console.log(voidSeparator);

const precision = 3;
let start;

function testNetwork() {
    sleep(1000).then(function () {
        hosts.forEach(function (host) {
            start = process.hrtime();
            ping.sys.probe(host, function (isAlive) {
                if (!isAlive) {
                    const msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
                    const elapsed = process.hrtime(start)[1] / 1000000;
                    console.log(msg + " " + elapsed.toFixed(precision) + "ms");
                }
            });
        });
        testNetwork();
    });
}

testNetwork();
