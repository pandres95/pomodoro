#!/usr/bin/env node

'use strict';

const args = [].concat(process.argv);
args.shift();
args.shift();

const Promisify = require('es-promisify');

const os = require('os');
const {
    constants,
    access: accessAsync,
    readFile: readFileAsync,
    writeFile: writeFileAsync
} = require('fs');

const timeout = milis =>
    new Promise((resolve, reject) => setTimeout(resolve, milis));
const access = Promisify(accessAsync);
const readFile = Promisify(readFileAsync);
const writeFile = Promisify(writeFileAsync);

async function main () {
    let child = require('daemon').daemon('./worker.js', args, { cwd: __dirname });

    if (os.platform() === 'darwin' || os.platform() === 'linux') {
        let pidPath = '/var/run';

        if (os.platform() === 'darwin') {
            pidPath = '/usr/local' + pidPath;
        }

        pidPath = pidPath + '/pomodoro.pid';

        try {
            try {
                await access(pidPath, constants.F_OK | constants.W_OK);

                const fileData = await readFile(pidPath);
                const pid = fileData.toString();
                process.kill(pid);
            } catch (error) {}

            await writeFile(pidPath, child.pid.toString());
        } catch (error) {
            console.error('There was an error trying to save the process PID');
            console.error(error);
        }
    }

    process.exit();
}

main();
