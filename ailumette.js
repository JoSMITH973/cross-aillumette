const path = require('path')
const { exec } = require("child_process");

if (process.argv[2] == '--gui') {
    console.log('command npm start launched')
    exec('npm start')
}