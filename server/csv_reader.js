const csv = require("csv-parser")
var fs = require("fs")
const moment = require("moment")
const tenMinAvg = require("./tenMinAvg")
var mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/binihouse")

var tenminAvgCount = 10	// tenMin Avg (10 number of minute data)
var hourAvgCount = 6 // 1hour = 6 times of 10min
var mins = 0

const dataMinCollection = require("./model").dataMinCollection
const dataTenMinCollection = require("./model").dataTenMinCollection



fs.createReadStream(__dirname + "/testdata.csv")
	.pipe(csv())
	.on("data", function(data) {

		var dataOneMin = new dataMinCollection({
			serNum: parseFloat(data.serNum),
			shoudo: parseFloat(data.shoudo),
			outOndo: parseFloat(data.outOndo),
			outSitsudo: parseFloat(data.outSitsudo),
			ame: parseFloat(data.ame),
			inOndo: parseFloat(data.inOndo),
			inSitsudo: parseFloat(data.inSitsudo),
			houshasen: parseFloat(data.houshasen),
			hitsuke: moment(data.hitsuke, "YYYY/M/DD").format("YYYY/MM/DD"),
			jikoku: data.jikoku,
			housachi: parseFloat(data.housachi),
			tar_housachi: parseFloat(data.tar_housachi),
			mist: parseFloat(data.mist) | 0,
			fan1: parseFloat(data.fan1) | 0,
			fan2: parseFloat(data.fan2) | 0,
			fan3: parseFloat(data.fan3) | 0,
			fan4: parseFloat(data.fan4) | 0,
			yobi1: parseFloat(data.yobi1) | 0,
			yobi3: parseFloat(data.yobi3) | 0,
			checksum: data.checksum

		})

		mins ++
		dataOneMin.save(function(err, success){
			if (err) throw err;
			console.log("saved one data successfully")


			if((mins % 10) === 0) {
				console.log(mins + " min")
				console.log("IS TEN MIN NOW")
			  	calAndSaveTenMinAvgData(10)		// save ten minute data to DB
			  	// reset tenMin
			  	mins = 0
			  	setTimeout(function() {}, 200)
			}



		})

})


// get minDatas and cal the avg of its, then save it to dataTenMinCollection
var calAndSaveTenMinAvgData = function(avgCount){
	tenMinAvg.getMinAndSaveTenMinAvgData(avgCount, function(err, success){
		if(err) {console.log(err)}
		else {
			console.log(success)
		}
	})
}

