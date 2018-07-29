'use strict';

const OS = require('os');
const Promisify = require('es-promisify');

const {
    constants,
    access: accessAsync,
    readFile: readFileAsync,
    unlink: unlinkAsync,
    writeFile: writeFileAsync
} = require('fs');

const access = Promisify(accessAsync);
const readFile = Promisify(readFileAsync);
const unlink = Promisify(unlinkAsync);
const writeFile = Promisify(writeFileAsync);

function getFilePath () {
    let pidPath = null;

    if (OS.platform() === 'darwin' || OS.platform() === 'linux') {
        pidPath = '/var/run';

        if (OS.platform() === 'darwin') {
            pidPath = '/usr/local' + pidPath;
        }

        pidPath = pidPath + '/pomodoro.pid';
    }

    return pidPath;
}

async function getPid () {
    try {
        await access(getFilePath(), constants.F_OK | constants.W_OK);
        const fileData = await readFile(getFilePath());

        return fileData.toString();
    } catch (_) {
        return null;
    }
};

async function setPid (value) {
    await writeFile(getFilePath(), value.toString());
};

async function killPid () {
    const pid = await getPid();
    if (pid !== null) {
        await unlink(getFilePath());
        process.kill(pid);
    }
};

exports.set = setPid;
exports.kill = killPid;
