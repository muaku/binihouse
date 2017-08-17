const controllers = require("./controllers")
const _ = require("underscore")
const dataMinCollection = require("./model").dataMinCollection

// @param: (fromJikoku, toJikoku) 
exports.getMinDataByJikoku = function(onHitsuke,fromJikoku, toJikoku, cb){
	var shoudo = 0,outOndo = 0,outSitsudo = 0,ame = 0,inOndo = 0,inSitsudo = 0,
	houshasen = 0,hitsuke = "",jikoku = "",housachi = 0,tar_housachi = 0,mist = 0,
	fan1 = 0,fan2 = 0,fan3 = 0,fan4 = 0

	var shoudoAvg = 0,outOndoAvg = 0,outSitsudoAvg = 0,ameAvg = 0,inOndoAvg = 0,
	inSitsudoAvg = 0,houshasenAvg = 0,housachiAvg = 0,tar_housachiAvg = 0,
	mistAvg = 0,fan1Avg = 0,fan2Avg = 0,fan3Avg = 0,fan4Avg = 0
	var dataCount = 0

	// query data fromJikoku ~ toJikoku & on only that date
	dataMinCollection.find(
		{
			"hitsuke": onHitsuke,
			"jikoku": {		
				$gte: fromJikoku, $lt: toJikoku
			}
		},
		 function(err, data){	// callback function
			if (err) return cb(err, null);
			if (_.isEmpty(data)) {
				//return	cb(null, null)
				// if nodata, set every value to 0
				var returnAvgData = {
					shoudo: 0,
					outOndo: 0,
					outSitsudo: 0,
					ame: 0,
					inOndo: 0,
					inSitsudo: 0,
					houshasen: 0,
					hitsuke: onHitsuke,
					jikoku: fromJikoku,
					housachi: 0,
					tar_housachi: 0,
					mist: 0,
					fan1: 0,
					fan2: 0,
					fan3: 0,
					fan4: 0
				}

				//return data
				return cb(null, returnAvgData)

			} 
			else {
				// if there are data
				// count the AVG
				dataCount = data.length
				console.log("dataCount: ", dataCount)

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
					if(i === 0) {	// apply hitsuke & jikoku only one time
						hitsuke = onHitsuke
						jikoku = fromJikoku
					}
				}

				// Cal each Avg data
				var returnAvgData = {
					shoudo: (shoudo / dataCount).toFixed(0),
					outOndo: (outOndo / dataCount).toFixed(2),
					outSitsudo: (outSitsudo / dataCount).toFixed(2),
					ame: (ame / dataCount) < 0.2 ? 0 : 1,
					inOndo: (inOndo / dataCount).toFixed(2),
					inSitsudo: (inSitsudo / dataCount).toFixed(2),
					houshasen: (houshasen / dataCount).toFixed(0),
					hitsuke: hitsuke,
					jikoku: jikoku,
					housachi: (housachi / dataCount).toFixed(3),
					tar_housachi: (tar_housachi / dataCount).toFixed(2),
					mist: (mist / dataCount) < 0.3 ? 0 : 1,
					fan1: (fan1 / dataCount) < 0.3 ? 0 : 1,
					fan2: (fan2 / dataCount) < 0.3 ? 0 : 1,
					fan3: (fan3 / dataCount) < 0.3 ? 0 : 1,
					fan4: (fan4 / dataCount) < 0.3 ? 0 : 1
				}

				console.log("returnAvgData: ", returnAvgData)
				//return data
				return cb(null, returnAvgData)

			}

			
	})

}



