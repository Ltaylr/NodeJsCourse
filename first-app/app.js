
//use const to prevent overriding exports from logger.js
const log = require('./logger.js');
const path = require('path');
const crypto = require('crypto');
const os = require('os')
const fs = require('fs');
//log("ehllo");

function sayHello(name)
{
    console.log('hello ' + name);
}

var pathObj = path.parse(__filename);

console.log(pathObj)

var totMem = os.totalmem();
var freeMem = os.freemem();

console.log(`Total Memory: ${totMem}`)
console.log(`Free Memory: ${freeMem}`)
//sayHello('lawry');
//console.log(window);

const files = fs.readdirSync('./')

console.log(files);

fs.readdir('$', function(err, files)
{
    if (err) console.log('Error', err);

    else console.log('Result', files);
});





