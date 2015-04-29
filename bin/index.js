#!/usr/bin/env node

var notifier    = require('node-notifier');
var path        = require('path');
var util        = require('util');
var argv        = require('yargs').argv;
var _           = require('underscore');

var workTime    = argv.work || 25
,   restTime    = _.map(argv._.length > 0 ? argv._ : [5, 15],
    function(t){
        return {
            action: "rest",
            time: Number(t)
        }
    }
);

var timings = [];
var user = argv.user || "pandres95";

function setInitialTiming(){
    console.log(workTime, restTime);
    for(time in restTime){
        timings.push({
            action: "work",
            time: workTime
        });
        timings.push(restTime[time]);
    }
    console.log(timings);
}

function getNextAction(){
    var actualTime = timings.shift();
    timings.push(actualTime);
    return actualTime;
}

function notify(user, action, time){
    var icon = path.join(__dirname,
        '..', 'img', (action === 'work'? 'go.png' : 'stop.png')
    );
    console.log(icon);
    notifier.notify({
        title: util.format('Hi %s', user),
        message: util.format(
            'It\'s time to %s, your next change is in %d minutes', action, time
        ),
        icon: icon,
        sound: true,
        wait: true
    }, function (err, response) {
        console.log("%s has been notified to %s", user, action);
    });
}

function start(){
    var theTime = getNextAction();
    notify(user, theTime.action, theTime.time);

    setTimeout(start, 1000 * theTime.time);
}

setInitialTiming();
start();
