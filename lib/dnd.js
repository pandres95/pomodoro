'use strict';

const OS = require('os');
const doNotDisturb = require('@sindresorhus/do-not-disturb');

module.exports.disable = async () => {
    if (OS.platform() === 'darwin') {
        await doNotDisturb.disable();
    }
};

module.exports.enable = async () => {
    if (OS.platform() === 'darwin') {
        await doNotDisturb.enable();
    }
};
