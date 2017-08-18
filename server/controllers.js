const _ = require("underscore")
const dataMinCollection = require("./model").dataMinCollection
const dataTenMinCollection = require("./model").dataTenMinCollection
const data1hourCollection = require("./model").data1hourCollection

// get oneMinData from DB and response back to user
exports.getOneMinData = function(req, res) {
	dataMinCollection.find({}, function(err, data){
		res.status(200).send(data)
	})
}

// get oneMinData from DB and response back to user
exports.getOneMinDataByDate = function(req, res) {
	var date = req.body.date
	dataMinCollection.find({"hitsuke": date},null, {sort: {created_at: 1}}, function(err, data){
		if(err){
			throw err;
		}
		if(_.isEmpty(data)){
			console.log("no data yet")
			return res.status(200).send("NODATA")
		}
		res.status(200).send(data)
	})
}


// get tenMinData from DB and response back to user
exports.getTenMinData = function(req, res) {
	var date = req.body.date
	console.log("date : ", date)
	dataTenMinCollection.find({"hitsuke": date},null, {sort: {created_at: 1}}, function(err, data){
		if(err){
			throw err;
		}
		if(_.isEmpty(data)){
			console.log("no data yet")
			return res.status(200).send("NODATA")
		}
		res.status(200).send(data)
	})
}


// GET 1hour Data from DB and response back to user
exports.get1hourData = (req, res) => {

	var fromDate = req.body.fromDate
	var toDate = req.body.toDate 
	console.log("fromDate : ", fromDate)
	console.log("toDate : ", toDate)

	data1hourCollection.find({"hitsuke": {		// toDate を含まない
		$gte: fromDate, $lt: toDate
	}},null, {sort: {hitsuke: 1}}, function(err, data){
		console.log("1hour Data: ", data)
		if(err){
			throw err;
		}
		if(_.isEmpty(data)){
			console.log("no data yet")
			return res.status(200).send("NODATA")
		}
		//console.log(data)
		res.status(200).send(data)
	})

}



// GET 1hour data for range 1month & calculate 6hour AVG
// For 1month Graph
exports.get1hourAndCal6hourAvgForMonthData = (req, res) => {

	var fromDate = req.body.fromDate
	var toDate = req.body.toDate
	var sikiichi = 0.3  // 20% 以上, 0.3を含まない
	var newArr = []
	var countFor6hour = 6
	console.log("fromDate : ", fromDate)
	console.log("toDate : ", toDate)

	// Get 1hour data for 1month
	data1hourCollection.find({"hitsuke": {		// toDate を含まない
		$gte: fromDate, $lt: toDate
	}},null, {sort: {hitsuke: 1}}, function(err, data){
		if(err){
			throw err;
		}
		if(_.isEmpty(data)){
			console.log("no data yet")
			return res.status(200).send("NODATA")
		}

		// IF: has data, then cal 6hour AVG
		// START: AVG 6hours
		//console.log("DATA: ", data)
		var len = data.length
		var g = Math.ceil(len / countFor6hour)
		console.log("len: ", len)
		console.log("g: ", g)
		for(i=0; i<g; i++) {
			if(i === g-1){ 
				newArr[i] = data.slice(i*countFor6hour)
				var insideLen = newArr[i].length
				// GET hitsuke, jikoku from the last one of that sliced array
				var hitsuke = data[len-1]["hitsuke"]
				var jikoku = data[len-1]["jikoku"]

				newArr[i] = newArr[i].reduce((preVal, curVal) => {	// Use reduce to cal a SUM
					
					return {
						"shoudo": preVal["shoudo"] + curVal["shoudo"],
						"outOndo": preVal["outOndo"] + curVal["outOndo"],
						"outSitsudo": preVal["outSitsudo"] + curVal["outSitsudo"],
						"ame": preVal["ame"] + curVal["ame"],
						"inOndo": preVal["inOndo"] + curVal["inOndo"],
						"inSitsudo": preVal["inSitsudo"] + curVal["inSitsudo"],
						"houshasen": preVal["houshasen"] + curVal["houshasen"],
						//"hitsuke": preVal["hitsuke"] + curVal["hitsuke"],
						//"jikoku": preVal["jikoku"] + curVal["jikoku"],
						"housachi": preVal["housachi"] + curVal["housachi"],
						"tar_housachi": preVal["tar_housachi"] + curVal["tar_housachi"],
						"mist": preVal["mist"] + curVal["mist"],
						"fan1": preVal["fan1"] + curVal["fan1"],
						"fan2": preVal["fan2"] + curVal["fan2"],
						"fan3": preVal["fan3"] + curVal["fan3"],
						"fan4": preVal["fan4"] + curVal["fan4"],
					}

				})

				// Cal the Average
				newArr[i]["shoudo"] = parseFloat((newArr[i]["shoudo"] / insideLen).toFixed(2))
				newArr[i]["outOndo"] = parseFloat((newArr[i]["outOndo"] / insideLen).toFixed(2))
				newArr[i]["outSitsudo"] = parseFloat((newArr[i]["outSitsudo"] / insideLen).toFixed(2))
				newArr[i]["inOndo"] = parseFloat((newArr[i]["inOndo"] / insideLen).toFixed(2))
				newArr[i]["inSitsudo"] = parseFloat((newArr[i]["inSitsudo"] / insideLen).toFixed(2))
				newArr[i]["houshasen"] = parseFloat((newArr[i]["houshasen"] / insideLen).toFixed(2))
				newArr[i]["housachi"] = parseFloat((newArr[i]["housachi"] / insideLen).toFixed(2))
				newArr[i]["tar_housachi"] = parseFloat((newArr[i]["tar_housachi"] / insideLen).toFixed(2))
				newArr[i]["ame"] = (newArr[i]["ame"] / insideLen) < sikiichi ? 0 : 1
				newArr[i]["mist"] = newArr[i]["mist"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan1"] = newArr[i]["fan1"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan2"] = newArr[i]["fan2"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan3"] = newArr[i]["fan3"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan4"] = newArr[i]["fan4"] / insideLen < sikiichi ? 0 : 1
				// Add hitsuke & jikoku to the array
				newArr[i]["hitsuke"] = hitsuke
				newArr[i]["jikoku"] = jikoku


			}
			else { 
				newArr[i] = data.slice(i*countFor6hour, i*countFor6hour + countFor6hour)
				var insideLen = newArr[i].length
				// GET hitsuke, jikoku from the last one of that sliced array
				var hitsuke2 = data[i*countFor6hour + countFor6hour-1]["hitsuke"]
				var jikoku2 = data[i*countFor6hour + countFor6hour-1]["jikoku"]




				newArr[i] = newArr[i].reduce((preVal, curVal) => {

					return {
						"shoudo": preVal["shoudo"] + curVal["shoudo"],
						"outOndo": preVal["outOndo"] + curVal["outOndo"],
						"outSitsudo": preVal["outSitsudo"] + curVal["outSitsudo"],
						"ame": preVal["ame"] + curVal["ame"],
						"inOndo": preVal["inOndo"] + curVal["inOndo"],
						"inSitsudo": preVal["inSitsudo"] + curVal["inSitsudo"],
						"houshasen": preVal["houshasen"] + curVal["houshasen"],
						"housachi": preVal["housachi"] + curVal["housachi"],
						"tar_housachi": preVal["tar_housachi"] + curVal["tar_housachi"],
						"mist": preVal["mist"] + curVal["mist"],
						"fan1": preVal["fan1"] + curVal["fan1"],
						"fan2": preVal["fan2"] + curVal["fan2"],
						"fan3": preVal["fan3"] + curVal["fan3"],
						"fan4": preVal["fan4"] + curVal["fan4"],
					}

				})

				// Cal the Average
				newArr[i]["shoudo"] = parseFloat((newArr[i]["shoudo"] / insideLen).toFixed(2))
				newArr[i]["outOndo"] = parseFloat((newArr[i]["outOndo"] / insideLen).toFixed(2))
				newArr[i]["outSitsudo"] = parseFloat((newArr[i]["outSitsudo"] / insideLen).toFixed(2))
				newArr[i]["inOndo"] = parseFloat((newArr[i]["inOndo"] / insideLen).toFixed(2))
				newArr[i]["inSitsudo"] = parseFloat((newArr[i]["inSitsudo"] / insideLen).toFixed(2))
				newArr[i]["houshasen"] = parseFloat((newArr[i]["houshasen"] / insideLen).toFixed(2))
				newArr[i]["housachi"] = parseFloat((newArr[i]["housachi"] / insideLen).toFixed(2))
				newArr[i]["tar_housachi"] = parseFloat((newArr[i]["tar_housachi"] / insideLen).toFixed(2))
				newArr[i]["ame"] = (newArr[i]["ame"] / insideLen) < sikiichi ? 0 : 1
				newArr[i]["mist"] = newArr[i]["mist"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan1"] = newArr[i]["fan1"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan2"] = newArr[i]["fan2"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan3"] = newArr[i]["fan3"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan4"] = newArr[i]["fan4"] / insideLen < sikiichi ? 0 : 1
				// Add hitsuke & jikoku to the array
				newArr[i]["hitsuke"] = hitsuke2
				newArr[i]["jikoku"] = jikoku2

				

			}
		}
	

		// END: AVG 6hours

		console.log("New Array data: ", newArr)

		res.send(newArr)

	})
}






// GET 1hour data for range 3months & calculate 12hour AVG
// For 3months Graph
exports.get1hourAndCal12hourAvgFor3MonthData = (req, res) => {

	var fromDate = req.body.fromDate
	var toDate = req.body.toDate
	var sikiichi = 0.3  // 20% 以上, 0.3を含まない
	var newArr = []
	var countFor12hour = 12
	console.log("fromDate : ", fromDate)
	console.log("toDate : ", toDate)

	// Get 1hour data for 1month
	data1hourCollection.find({"hitsuke": {		// toDate を含まない
		$gte: fromDate, $lt: toDate
	}},null, {sort: {hitsuke: 1}}, function(err, data){
		if(err){
			throw err;
		}
		if(_.isEmpty(data)){
			console.log("no data yet")
			return res.status(200).send("NODATA")
		}

		// IF: has data, then cal 6hour AVG
		// START: AVG 6hours

		var len = data.length
		var g = Math.ceil(len / countFor12hour)
		console.log("len: ", len)
		console.log("g: ", g)
		for(i=0; i<g; i++) {
			if(i === g-1){ 
				newArr[i] = data.slice(i*countFor12hour)
				var insideLen = newArr[i].length
				// GET hitsuke, jikoku from the last one of that sliced array
				var hitsuke = data[len-1]["hitsuke"]
				var jikoku = data[len-1]["jikoku"]

				newArr[i] = newArr[i].reduce((preVal, curVal) => {	// Use reduce to cal a SUM
					
					return {
						"shoudo": preVal["shoudo"] + curVal["shoudo"],
						"outOndo": preVal["outOndo"] + curVal["outOndo"],
						"outSitsudo": preVal["outSitsudo"] + curVal["outSitsudo"],
						"ame": preVal["ame"] + curVal["ame"],
						"inOndo": preVal["inOndo"] + curVal["inOndo"],
						"inSitsudo": preVal["inSitsudo"] + curVal["inSitsudo"],
						"houshasen": preVal["houshasen"] + curVal["houshasen"],
						//"hitsuke": preVal["hitsuke"] + curVal["hitsuke"],
						//"jikoku": preVal["jikoku"] + curVal["jikoku"],
						"housachi": preVal["housachi"] + curVal["housachi"],
						"tar_housachi": preVal["tar_housachi"] + curVal["tar_housachi"],
						"mist": preVal["mist"] + curVal["mist"],
						"fan1": preVal["fan1"] + curVal["fan1"],
						"fan2": preVal["fan2"] + curVal["fan2"],
						"fan3": preVal["fan3"] + curVal["fan3"],
						"fan4": preVal["fan4"] + curVal["fan4"],
					}

				})

				// Cal the Average
				newArr[i]["shoudo"] = parseFloat((newArr[i]["shoudo"] / insideLen).toFixed(2))
				newArr[i]["outOndo"] = parseFloat((newArr[i]["outOndo"] / insideLen).toFixed(2))
				newArr[i]["outSitsudo"] = parseFloat((newArr[i]["outSitsudo"] / insideLen).toFixed(2))
				newArr[i]["inOndo"] = parseFloat((newArr[i]["inOndo"] / insideLen).toFixed(2))
				newArr[i]["inSitsudo"] = parseFloat((newArr[i]["inSitsudo"] / insideLen).toFixed(2))
				newArr[i]["houshasen"] = parseFloat((newArr[i]["houshasen"] / insideLen).toFixed(2))
				newArr[i]["housachi"] = parseFloat((newArr[i]["housachi"] / insideLen).toFixed(2))
				newArr[i]["tar_housachi"] = parseFloat((newArr[i]["tar_housachi"] / insideLen).toFixed(2))
				newArr[i]["ame"] = (newArr[i]["ame"] / insideLen) < sikiichi ? 0 : 1
				newArr[i]["mist"] = newArr[i]["mist"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan1"] = newArr[i]["fan1"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan2"] = newArr[i]["fan2"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan3"] = newArr[i]["fan3"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan4"] = newArr[i]["fan4"] / insideLen < sikiichi ? 0 : 1
				// Add hitsuke & jikoku to the array
				newArr[i]["hitsuke"] = hitsuke
				newArr[i]["jikoku"] = jikoku


			}
			else { 
				newArr[i] = data.slice(i*countFor12hour, i*countFor12hour + countFor12hour)
				var insideLen = newArr[i].length
				// GET hitsuke, jikoku from the last one of that sliced array
				var hitsuke = data[i*countFor12hour + countFor12hour-1]["hitsuke"]
				var jikoku = data[i*countFor12hour + countFor12hour-1]["jikoku"]

				newArr[i] = newArr[i].reduce((preVal, curVal) => {

					return {
						"shoudo": preVal["shoudo"] + curVal["shoudo"],
						"outOndo": preVal["outOndo"] + curVal["outOndo"],
						"outSitsudo": preVal["outSitsudo"] + curVal["outSitsudo"],
						"ame": preVal["ame"] + curVal["ame"],
						"inOndo": preVal["inOndo"] + curVal["inOndo"],
						"inSitsudo": preVal["inSitsudo"] + curVal["inSitsudo"],
						"houshasen": preVal["houshasen"] + curVal["houshasen"],
						"housachi": preVal["housachi"] + curVal["housachi"],
						"tar_housachi": preVal["tar_housachi"] + curVal["tar_housachi"],
						"mist": preVal["mist"] + curVal["mist"],
						"fan1": preVal["fan1"] + curVal["fan1"],
						"fan2": preVal["fan2"] + curVal["fan2"],
						"fan3": preVal["fan3"] + curVal["fan3"],
						"fan4": preVal["fan4"] + curVal["fan4"],
					}

				})

				// Cal the Average
				newArr[i]["shoudo"] = parseFloat((newArr[i]["shoudo"] / insideLen).toFixed(2))
				newArr[i]["outOndo"] = parseFloat((newArr[i]["outOndo"] / insideLen).toFixed(2))
				newArr[i]["outSitsudo"] = parseFloat((newArr[i]["outSitsudo"] / insideLen).toFixed(2))
				newArr[i]["inOndo"] = parseFloat((newArr[i]["inOndo"] / insideLen).toFixed(2))
				newArr[i]["inSitsudo"] = parseFloat((newArr[i]["inSitsudo"] / insideLen).toFixed(2))
				newArr[i]["houshasen"] = parseFloat((newArr[i]["houshasen"] / insideLen).toFixed(2))
				newArr[i]["housachi"] = parseFloat((newArr[i]["housachi"] / insideLen).toFixed(2))
				newArr[i]["tar_housachi"] = parseFloat((newArr[i]["tar_housachi"] / insideLen).toFixed(2))
				newArr[i]["ame"] = (newArr[i]["ame"] / insideLen) < sikiichi ? 0 : 1
				newArr[i]["mist"] = newArr[i]["mist"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan1"] = newArr[i]["fan1"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan2"] = newArr[i]["fan2"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan3"] = newArr[i]["fan3"] / insideLen < sikiichi ? 0 : 1
				newArr[i]["fan4"] = newArr[i]["fan4"] / insideLen < sikiichi ? 0 : 1
				// Add hitsuke & jikoku to the array
				newArr[i]["hitsuke"] = hitsuke
				newArr[i]["jikoku"] = jikoku

				

			}
		}
	

		// END: AVG 6hours

		console.log("New Array data: ", newArr)

		res.send(newArr)

	})
}



// Get sekisan 温度
exports.getSekisanOndo = (req, res) => {
	var fromDate = req.body.fromDate
	var toDate = req.body.toDate

	console.log("fromDate: " + fromDate + " ,toDate: " + toDate)

	data1hourCollection.find({"hitsuke": {		// toDate を含まない
		$gte: fromDate, $lt: toDate
	}},{inOndo: 1, hitsuke: 1}, {sort: {hitsuke: 1}}, function(err, data){
		console.log("SekisanData: ", data)

		var sekisanOndoByDate = {}
		var sekisanOndoAmountForDate = {}
		var arrayOfDate = []
		var num = data.length
		var i = 0

		data.forEach((el) => {
			// sum the inOndo value for the same date
			sekisanOndoByDate[el["hitsuke"]] = sekisanOndoByDate[el["hitsuke"]] + el["inOndo"] || el["inOndo"]
			// count the amount of data on that date
			sekisanOndoAmountForDate[el["hitsuke"]] = sekisanOndoAmountForDate[el["hitsuke"]] + 1 || 1
			// push date, if date is not exist in an array
			if(arrayOfDate.indexOf(el["hitsuke"]) === -1) {
				arrayOfDate.push(el["hitsuke"])
			}
			
		})

		console.log("sekisanOndoByDate: ", sekisanOndoByDate)
		console.log("sekisanOndoAmountForDate: ", sekisanOndoAmountForDate)
		console.log("arrayOfDate: ", arrayOfDate)

		// Cal each AVG value of day's ondo
		arrayOfDate.forEach(el => {
			sekisanOndoByDate[el] = parseFloat((sekisanOndoByDate[el] / sekisanOndoAmountForDate[el]).toFixed(2))
		})

		// GOT, AVG Ondo for each day (store in sekisanOndoByDate)
		console.log("AVG of day's ondo: ", sekisanOndoByDate)

		// Final: Caculate Sekisan ondo by plus+ up each date value
		for(var j = 0; j < arrayOfDate.length ; j++) {
			if(j!=0) {
				sekisanOndoByDate[arrayOfDate[j]] = parseFloat((sekisanOndoByDate[arrayOfDate[j-1]] + sekisanOndoByDate[arrayOfDate[j]]).toFixed(2))
			}
		}

		//
		console.log("SekisanOndo : ", sekisanOndoByDate)

		// Response sekisanondo data

		var resData = { "arrayOfDate": arrayOfDate, "sekisanOndoByDate": sekisanOndoByDate}
		res.send(resData)


	})

}


// Get nisshoudo jikan
exports.getNisshoudojikan = (req, res) => {
	var fromDate = req.body.fromDate
	var toDate = req.body.toDate
	var shoudo_shikiichi = 1000

	// get shoudo that bigger than shoudo_shikiichi from dataMinCollection
	dataMinCollection.find({"hitsuke": {		
		$gte: fromDate, $lt: toDate
	}, "shoudo": { $gte: shoudo_shikiichi}},{shoudo: 1, hitsuke: 1}, {sort: {hitsuke: 1}}, function(err, data){
		//console.log("nisshoudoJikan Data: ", data)

		// count how many data in each day (means -> how many minute in each day)
		var counts = {}
		var arrayOfNishouDate = []
		data.forEach(function(x) {
			counts[x["hitsuke"]] = (counts[x["hitsuke"]] || 0) + 1
			// push date, if date is not exist in an array
			if(arrayOfNishouDate.indexOf(x["hitsuke"]) === -1) {
				arrayOfNishouDate.push(x["hitsuke"])
			}
		})

		console.log("counts: ", counts)
		console.log("arrayOfNishouDate: ", arrayOfNishouDate)

		// Final: Caculate Sekisan ondo by plus+ up each date value
		var countsLen = _.size(counts)
		console.log("counts.length: ", countsLen)
		for(var j = 0; j < countsLen ; j++) {
			if(j!=0) {
				counts[arrayOfNishouDate[j]] = (counts[arrayOfNishouDate[j-1]] + counts[arrayOfNishouDate[j]])
				
			}
		}

		//// convert mins to hours
		for (var k = 0; k < countsLen; k++){
			counts[arrayOfNishouDate[k]] = parseFloat((counts[arrayOfNishouDate[k]] / 60).toFixed(2))
		}

		console.log("counts2: ", counts)

		// Response Nishoujikan data
		var resData = { "arrayOfNishouDate": arrayOfNishouDate, "NishoujikanByDate": counts}
		res.send(resData)

	})
}

//
var getTimeFromMins = (mins) => {
	var h = mins / 60 | 0
	var m = mins % 60 | 0
	return (h + ":" + m)
} 






// get minData from the lastest one with limitation
exports.getMinDataFromLastOne = function(limit, cb) {
	var dataLength = dataMinCollection.count()	// get document number in dataMinCollections

	dataMinCollection.find({},null,{skip: 0, sort:{created_at: -1}, limit: limit},function(err, data){
		if (err) throw err;
		if (!data) {
			return	cb(null, null)
		}
		cb(null, data)
	})
}


// GET 10minData from the lastest one with limitation to calculate average and store as 1hour data
exports.get10MinDataFromLastOne = (limit, cb) => {
	var dtLen = dataTenMinCollection.count()	// count documents in dataTenMinCollection

	dataTenMinCollection.find({}, null, {skip: 0, sort:{created_at: -1}, limit: limit}, (err, data) => {
		if (err) { throw err}
		if (!data) {
			return cb(null, null)
		}
		cb(null, data)
	})
	
}


// Add serial data every min to dataMinCollection
exports.storeMinData = function(data, cb){
	var dataOneMin = new dataMinCollection({
		serNum: data.serNum,
		shoudo: data.shoudo,
		outOndo: data.outOndo,
		outSitsudo: data.outSitsudo,
		ame: data.ame,
		inOndo: data.inOndo,
		inSitsudo: data.inSitsudo,
		houshasen: data.houshasen,
		hitsuke: data.hitsuke,
		jikoku: data.jikoku,
		housachi: data.housachi,
		tar_housachi: data.tar_housachi,
		mist: data.mist,
		fan1: data.fan1,
		fan2: data.fan2,
		fan3: data.fan3,
		fan4: data.fan4,
		yobi1: data.yobi1,
		yobi3: data.yobi3,
		leftKaten: data.leftKaten,
		rightKaten: data.rightKaten,
		leftBiniiru: data.leftBiniiru,
		rightBiniiru: data.rightBiniiru,
		leftTenjouKaten: data.leftTenjouKaten,
		rightTenjouKaten: data.rightTenjouKaten,
		checksum: data.checksum,
	})
	dataOneMin.save(function(err, success){
		if (err) return cb(err, null);
		cb(null, "saved one data successfully")
	})
}


// store ten minute average data to dataTenMinCollection
exports.storeTenMinData = function(data, cb){
	var dataTenMin = new dataTenMinCollection({
		serNum: data.serNum,
		shoudo: data.shoudo,
		outOndo: data.outOndo,
		outSitsudo: data.outSitsudo,
		ame: data.ame,
		inOndo: data.inOndo,
		inSitsudo: data.inSitsudo,
		houshasen: data.houshasen,
		hitsuke: data.hitsuke,
		jikoku: data.jikoku,
		housachi: data.housachi,
		tar_housachi: data.tar_housachi,
		mist: data.mist,
		fan1: data.fan1,
		fan2: data.fan2,
		fan3: data.fan3,
		fan4: data.fan4,
		yobi1: data.yobi1,
		yobi3: data.yobi3,
		leftKaten: data.leftKaten,
		rightKaten: data.rightKaten,
		leftBiniiru: data.leftBiniiru,
		rightBiniiru: data.rightBiniiru,
		leftTenjouKaten: data.leftTenjouKaten,
		rightTenjouKaten: data.rightTenjouKaten,
		checksum: data.checksum
	})
	dataTenMin.save(function(err, success){
		if (err) throw err;
		cb(null, "Successfully saved tenMinData")
	})
}


// STORE 1hour AVG data to data1hourCollection
exports.store1hourData = (data, cb) => {

	var hourData = new data1hourCollection({
		serNum: data.serNum,
		shoudo: data.shoudo,
		outOndo: data.outOndo,
		outSitsudo: data.outSitsudo,
		ame: data.ame,
		inOndo: data.inOndo,
		inSitsudo: data.inSitsudo,
		houshasen: data.houshasen,
		hitsuke: data.hitsuke,
		jikoku: data.jikoku,
		housachi: data.housachi,
		tar_housachi: data.tar_housachi,
		mist: data.mist,
		fan1: data.fan1,
		fan2: data.fan2,
		fan3: data.fan3,
		fan4: data.fan4,
		yobi1: data.yobi1,
		yobi3: data.yobi3,
		leftKaten: data.leftKaten,
		rightKaten: data.rightKaten,
		leftBiniiru: data.leftBiniiru,
		rightBiniiru: data.rightBiniiru,
		leftTenjouKaten: data.leftTenjouKaten,
		rightTenjouKaten: data.rightTenjouKaten,
		checksum: data.checksum
	})
	hourData.save(function(err, success){
		if (err) throw err;
		cb(null, "Successfully saved 1hour data")
	})

}




