var CronJob = require('cron').CronJob;
var moment = require('moment');
const tenMinAvg = require("./tenMinAvg")
var controllers = require("./controllers")
const _ = require("underscore")

module.exports.everyTenminJob = new CronJob({
  cronTime: '*/10 * * * *', // min hour day(month) month year
  onTick: function() {
    // when triggered
    console.log("10min Job triggered at ", Date())
    // get hour and minute from date
    var now = moment()
    var onHitsuke = now
    var hour = now.hour()
    var min = now.minutes()

    tenminTriggerCron(onHitsuke, hour, min)
  },
  onComplete: function() {
    // when job is completed
  },
  start: false, // start the job right now
  timeZone: 'Asia/Tokyo'   // time zone
})

// When cron was triggered, then query 1min data and count the AVG of 10min
var tenminTriggerCron = (onHitsuke, hour, min) => {
    console.log("hour: " + hour + " min: " + min)
    // do a job by time case
    // minute case
    var fromMin = (min == 0) ? 50 : min - 10
    var toMin = fromMin + 9
    // hour case
    var fromHour 
    var toHour
    if(hour == 0 && min == 0) {
        fromHour = 23
        onHitsuke = onHitsuke.subtract(1, "days").format("YYYY/MM/DD")
    } 
    else if(min == 0) {
        fromHour = hour -1
    }
    else {
        fromHour = hour
        onHitsuke = onHitsuke.format("YYYY/MM/DD")
    }
    
    // change hour format, to match DB format
    fromHour = (fromHour < 10) ? "0"+fromHour : fromHour
    toHour = fromHour
    // Change minute format to match DB format
    fromMin = (fromMin < 10) ? "0"+fromMin : fromMin
    toMin = (toMin < 10) ? "0"+toMin : toMin

    var fromJikoku = fromHour + ":" + fromMin
    var toJikoku = toHour + ":" + toMin

    console.log("fromJikoku: " + fromJikoku)
    console.log("toJikoku: " + toJikoku)

    // send onHitsuke fromJikoku and toJikoku to query data from db
    tenMinAvg.getMinDataByJikoku(onHitsuke, fromJikoku, toJikoku, (err, data) => {
        if(err) throw err
        if(!_.isEmpty(data)) {
            // save data to tenminDB
            controllers.storeTenMinData(data, function(err, data){
                // if err
                if(err) {console.log(err)}
                else {
                    // pass back avg data
                    console.log("success on save tenmin data")
                }
            })
        }
    })
    
}


/*
* Get 10minData and calculate 1hour data
*
*/
module.exports.every1hourJob = new CronJob({
  cronTime: '0 * * * *', // trigger every 1hour (trigger on minute is 0)
  onTick: function() {
    // when triggered
    console.log("1 hour Job triggered at ", Date())
    // get hour and minute from date
    var now = moment()
    var onHitsuke = now
    var hour = now.hour()
    var min = now.minutes()

    hourTriggerCron(onHitsuke, hour, min)
  },
  onComplete: function() {
    // when job is completed
  },
  start: false, // start the job right now
  timeZone: 'Asia/Tokyo'   // time zone
});

//
var hourTriggerCron = (onHitsuke, hour, min) => {
    console.log("hour: " + hour + " min: " + min)
    // hour case
    var fromHour 
    var toHour
    if(hour == 0) {
        fromHour = 23
        onHitsuke = onHitsuke.subtract(1, "days").format("YYYY/MM/DD")
    } 
    else {
        fromHour = hour -1
        onHitsuke = onHitsuke.format("YYYY/MM/DD")
    }
    
    // change hour format, to match DB format
    fromHour = (fromHour < 10) ? "0"+fromHour : fromHour
    toHour = fromHour

    var fromJikoku = fromHour + ":00" 
    var toJikoku = toHour + ":59"

    console.log("fromJikoku: " + fromJikoku)
    console.log("toJikoku: " + toJikoku)

    // send onHitsuke fromJikoku and toJikoku to query data from db
    tenMinAvg.getMinDataByJikoku(onHitsuke, fromJikoku, toJikoku, (err, data) => {
        if(err) throw err
        if(!_.isEmpty(data)) {
            controllers.store1hourData(data, (err, done) => {
                // if err
                if(err) {console.log(err)}
                else {
                    // pass back avg data
                    console.log("success on save tenmin data")
                }
            })
        }
    })
}
