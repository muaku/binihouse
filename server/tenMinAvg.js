const controllers = require("./controllers")


exports.getMinAndSaveTenMinAvgData = function(avgCount, cb){
	var shoudo = 0,
	outOndo = 0,
	outSitsudo = 0,
	ame = 0,
	inOndo = 0,
	inSitsudo = 0,
	houshasen = 0,
	hitsuke = "",
	jikoku = "",
	housachi = 0,
	tar_housachi = 0,
	mist = 0,
	fan1 = 0,
	fan2 = 0,
	fan3 = 0,
	fan4 = 0

	var shoudoAvg = 0,
	outOndoAvg = 0,
	outSitsudoAvg = 0,
	ameAvg = 0,
	inOndoAvg = 0,
	inSitsudoAvg = 0,
	houshasenAvg = 0,
	housachiAvg = 0,
	tar_housachiAvg = 0,
	mistAvg = 0,
	fan1Avg = 0,
	fan2Avg = 0,
	fan3Avg = 0,
	fan4Avg = 0
	var dataCount = 0

	// get 10 documents from dataMinCollection
	controllers.getMinDataFromLastOne(avgCount, function(err, data){
		dataCount = data.length		// the data length that we retrieved
		console.log("dataCount: ", dataCount)
		console.log("Data: ", data)
		// Sum ten data
		for(var i=0; i<dataCount; i++){
			shoudo += data[i].shoudo
			outOndo += data[i].outOndo
			outSitsudo += data[i].outSitsudo
			ame += data[i].ame
			inOndo += data[i].inOndo
			inSitsudo += data[i].inSitsudo
			houshasen += data[i].houshasen
			housachi += data[i].housachi
			tar_housachi += data[i].tar_housachi
			mist += data[i].mist
			fan1 += data[i].fan1
			fan2 += data[i].fan2
			fan3 += data[i].fan3
			fan4 += data[i].fan4
			if(i === dataCount-1) {	// apply hitsuke & jikoku to the last one of data
				hitsuke = data[i].hitsuke
				jikoku = cleanTime(data[i].jikoku)	// 四捨五入
			}
		}
		// Cal each Avg
		shoudoAvg = (shoudo / dataCount).toFixed(0)
		outOndoAvg = (outOndo / dataCount).toFixed(2)
		outSitsudoAvg = (outSitsudo / dataCount).toFixed(2)
		ameAvg = (ame / dataCount) < 0.2 ? 0 : 1
		inOndoAvg = (inOndo / dataCount).toFixed(2)
		inSitsudoAvg = (inSitsudo / dataCount).toFixed(2)
		houshasenAvg = (houshasen / dataCount).toFixed(0)
		housachiAvg = (housachi / dataCount).toFixed(3)
		tar_housachiAvg = (tar_housachi / dataCount).toFixed(2)
		mistAvg = (mist / dataCount) < 0.3 ? 0 : 1
		fan1Avg = (fan1 / dataCount) < 0.3 ? 0 : 1
		fan2Avg = (fan2 / dataCount) < 0.3 ? 0 : 1
		fan3Avg = (fan3 / dataCount) < 0.3 ? 0 : 1
		fan4Avg = (fan4 / dataCount) < 0.3 ? 0 : 1

		var returnAvgData = {
			shoudo: shoudoAvg,
			outOndo: outOndoAvg,
			outSitsudo: outSitsudoAvg,
			ame: ameAvg,
			inOndo: inOndoAvg,
			inSitsudo: inSitsudoAvg,
			houshasen: houshasenAvg,
			hitsuke: hitsuke,
			jikoku: jikoku,
			housachi: housachiAvg,
			tar_housachi: tar_housachiAvg,
			mist: mistAvg,
			fan1: fan1Avg,
			fan2: fan2Avg,
			fan3: fan3Avg,
			fan4: fan4Avg
		}

		console.log("returnAvgData: ", returnAvgData)

		controllers.storeTenMinData(returnAvgData, function(err, success){
			// if err
			if(err) return cb(err, null)
			// pass back avg data
			cb(null, success)
		})

	})
}


// convert Time format hh:mm to hh.mm then use しさごにゅう
var cleanTime = function(jikoku) {
	var pt = parseFloat(jikoku.replace(":", ".")) * 10
	var ct = (Math.round(pt) / 10).toFixed(2)
	var rt = ct.replace(".",":")
	return rt
}




// GET tenmin data and cal the avg for 1hour then save it into 1hourCollection
exports.getTenMinAndSave1hourAvgData = function(avgCount, cb){
	var shoudo = 0,
	outOndo = 0,
	outSitsudo = 0,
	ame = 0,
	inOndo = 0,
	inSitsudo = 0,
	houshasen = 0,
	hitsuke = "",
	jikoku = "",
	housachi = 0,
	tar_housachi = 0,
	mist = 0,
	fan1 = 0,
	fan2 = 0,
	fan3 = 0,
	fan4 = 0

	var shoudoAvg = 0,
	outOndoAvg = 0,
	outSitsudoAvg = 0,
	ameAvg = 0,
	inOndoAvg = 0,
	inSitsudoAvg = 0,
	houshasenAvg = 0,
	housachiAvg = 0,
	tar_housachiAvg = 0,
	mistAvg = 0,
	fan1Avg = 0,
	fan2Avg = 0,
	fan3Avg = 0,
	fan4Avg = 0
	var dataCount = 0

	// get 10 documents from dataMinCollection
	controllers.get10MinDataFromLastOne(avgCount, function(err, data){
		dataCount = data.length		// the data length that we retrieved
		console.log("dataCount for 1hourCollection: ", dataCount)
		console.log("Data of 1hourCollection: ", data)
		// Sum ten data
		for(var i=0; i<dataCount; i++){
			shoudo += data[i].shoudo
			outOndo += data[i].outOndo
			outSitsudo += data[i].outSitsudo
			ame += data[i].ame
			inOndo += data[i].inOndo
			inSitsudo += data[i].inSitsudo
			houshasen += data[i].houshasen
			housachi += data[i].housachi
			tar_housachi += data[i].tar_housachi
			mist += data[i].mist
			fan1 += data[i].fan1
			fan2 += data[i].fan2
			fan3 += data[i].fan3
			fan4 += data[i].fan4
			if(i === dataCount-1) {	// apply hitsuke & jikoku to the last one of data
				hitsuke = data[i].hitsuke
				jikoku = data[i].jikoku
			}
		}
		// Cal each Avg
		shoudoAvg = (shoudo / dataCount).toFixed(0)
		outOndoAvg = (outOndo / dataCount).toFixed(2)
		outSitsudoAvg = (outSitsudo / dataCount).toFixed(2)
		ameAvg = (ame / dataCount) < 0.2 ? 0 : 1
		inOndoAvg = (inOndo / dataCount).toFixed(2)
		inSitsudoAvg = (inSitsudo / dataCount).toFixed(2)
		houshasenAvg = (houshasen / dataCount).toFixed(0)
		housachiAvg = (housachi / dataCount).toFixed(3)
		tar_housachiAvg = (tar_housachi / dataCount).toFixed(2)
		mistAvg = (mist / dataCount) < 0.3 ? 0 : 1
		fan1Avg = (fan1 / dataCount) < 0.3 ? 0 : 1
		fan2Avg = (fan2 / dataCount) < 0.3 ? 0 : 1
		fan3Avg = (fan3 / dataCount) < 0.3 ? 0 : 1
		fan4Avg = (fan4 / dataCount) < 0.3 ? 0 : 1

		var returnAvgData = {
			shoudo: shoudoAvg,
			outOndo: outOndoAvg,
			outSitsudo: outSitsudoAvg,
			ame: ameAvg,
			inOndo: inOndoAvg,
			inSitsudo: inSitsudoAvg,
			houshasen: houshasenAvg,
			hitsuke: hitsuke,
			jikoku: jikoku,
			housachi: housachiAvg,
			tar_housachi: tar_housachiAvg,
			mist: mistAvg,
			fan1: fan1Avg,
			fan2: fan2Avg,
			fan3: fan3Avg,
			fan4: fan4Avg
		}

		console.log("returnAvgData: ", returnAvgData)

		controllers.store1hourData(returnAvgData, function(err, success){
			// if err
			if(err) return cb(err, null)
			// pass back avg data
			cb(null, success)
		})

	})
}