var mongoose = require("mongoose")
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')
const _ = require("underscore")
const moment = require("moment")
const os = require("os")

var SerialPort = require('serialport');
var routes = require("./routes")
const controllers = require("./controllers")
const tenMinAvg = require("./tenMinAvg")
var csvWriter = require("./csvWriterModule")
var fanStatus = require("./FanStatus")

var port
var tenminAvgCount = 10	// tenMin Avg (10 number of minute data)
var hourAvgCount = 6 // 1hour = 6 times of 10min
//var mins = 0
var tenmins = 0
var ft = true

csvWriter.createFile()	// create csv file

// Connect to mongodb and Server
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/binihouse", { useMongoClient: true})
	.then(() => console.log("Connected to db"))
	.catch(() => console.log("Error on db connection"))
server.listen(30000);



app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use("/", routes)


// ------------------------------------



// Socket io , listen to start and stop button
io.sockets.on('connection', function(socket) {
	console.log("Connected")
	ft = true
	// on connection
	socket.emit("status","Connected")
	// start a connection
  socket.on('onStart', function(portNumber) {
    openPort(portNumber)
    serialportEvent()	// start listening to serialPort
    // if not first time should run this
    if(ft == false) {
    	socket.emit("onStart", "通信を開始しました")
    }
    
  })
  // // stop a connection
  socket.on('onStop', function(portNumber) {
    closePort(function(err, done){
    	socket.emit("onStop", done)
    })
  });

  // Emit serial port number
  socket.on("portNumber", function(data){
  	portListEmitter()
  })


});

// function that trigger every minute to check time for 00,10,20,..,50


//
var openPort = function(portNumber){
	port = new SerialPort(portNumber, {
	  baudRate: 115200,
	  parser: SerialPort.parsers.readline('\n')
	});
}

var closePort = function(cb){
	if(!_.isEmpty(port)){
		port.close(function(err){
			if (err) {return console.log("No port to Close")}
			cb(null, "通信を停止しました。")

		})
	}
}


var serialportEvent = function(){
	var mins = 0
	// SerialPort
	port.on('open', function() {
	  console.log("port is open")
	});

	// open errors will be emitted as an error event
	port.on('error', function(err) {
	  console.log('Error: ', err.message);
	})

	port.on('data', function (data) {
		// emit only firstTime
		if(ft == true) {
			//io.sockets.emit('dataOK', "OK"); 
			io.sockets.emit("onStart", "通信を開始しました")
			ft = false
		}
		
	  var doneData = returnSeparatedDataInJson(data)
	  console.log(doneData)
	  //io.sockets.emit('msg', doneData);   // Emit realTime data to frontEnd]

	  csvWriter.write(doneData)		// write to csv file

	  mins++
	  console.log("mins: ", mins)
	  controllers.storeMinData(doneData, function(err, success){	// save minute data to DB
	  	if(err) throw err;
	  	console.log("Stored 1min")
	  	if((mins % tenminAvgCount) === 0) {
		  	console.log("IS TEN MIN NOW")
		  	calAndSaveTenMinAvgData(tenminAvgCount)		// save ten minute data to DB
		  	// reset tenMin
		  	mins = 0
		  	tenmins ++	// Reach 10min
		  	console.log("tenmins: ", tenmins)
		  	// If time reach 1hour, its mean 10min data has reach 6times
		  	if((tenmins % hourAvgCount) === 0 ) {
		  		console.log("IS 1hour NOQ")
		  		calAndSave1hourAvgData(hourAvgCount)
		  		tenmins = 0
		  	}
		  }
	  })		

	});
}

// get all open port	
var portListEmitter = function(){
	var portsNumber = []
	SerialPort.list(function(err,  openPorts){
		for(var i = 0; i<openPorts.length; i++){
			portsNumber.push(openPorts[i].comName)
		}
		console.log("portsNumber: ", portsNumber)
		io.sockets.emit('portNumber', portsNumber); 
	})
} 


// get minDatas and cal the avg of its, then save it to dataTenMinCollection
var calAndSaveTenMinAvgData = function(avgCount){
	tenMinAvg.getMinAndSaveTenMinAvgData(avgCount, function(err, success){
		if(err) {console.log(err)}
		else {
			console.log(success)
		}
	})
}

// GET tenmin data and cal the avg of it, then save it to data10minCollection
var calAndSave1hourAvgData = function(avgCount){
	tenMinAvg.getTenMinAndSave1hourAvgData(avgCount, function(err, success){
		if(err) {console.log(err)}
		else {
			console.log(success)
		}
	})
}



// data process
var dataSplitterByComma = function(data){
	var splittedArrayData = data.split(",")
	return splittedArrayData
}

// Split data by ":" and get the second part
var dataSplitterByCuron = function(data){
	var splittedArrayData = data.split(":")
	return splittedArrayData
}

 // separated All Data
var returnSeparatedDataInArray = function(data){
	 // split data by ","
	if (data){
		var commaSplitData = dataSplitterByComma(data)
		
		var separatedRecvData = []
		var curonSplitData
		for(i=0; i<commaSplitData.length; i++){
			switch (i){
				case 0:
					// Nシリアルナンバー
					curonSplitData = commaSplitData[i].slice(1)	// Remove N
					break
				case 1:
					// 0:照度
					console.log(typeof(dataSplitterByCuron(commaSplitData[i])[1]))
					curonSplitData = parseInt(dataSplitterByCuron(commaSplitData[i])[1])
					break
				case 2:
					// 1:外温度
					curonSplitData = parseFloat(dataSplitterByCuron(commaSplitData[i])[1]).toFixed(2)
					break
				case 3:
					// 2:外湿度
					curonSplitData = parseFloat(dataSplitterByCuron(commaSplitData[i])[1]).toFixed(2)
					break
				case 4:
					// split data by ":"
					curonSplitData = parseInt(dataSplitterByCuron(commaSplitData[i])[1])
					break
				case 5:
					// split data by ":"
					curonSplitData = parseFloat(dataSplitterByCuron(commaSplitData[i])[1]).toFixed(2)
					break
				case 6:
					// split data by ":"
					curonSplitData = parseFloat(dataSplitterByCuron(commaSplitData[i])[1]).toFixed(2)
					break
				case 7:
					// 放射線
					curonSplitData = parseInt(dataSplitterByCuron(commaSplitData[i])[1])
					break
				case 8:
					// 日付
					curonSplitData = moment(dataSplitterByCuron(commaSplitData[i])[1], "YY/M/DD").format("YYYY/MM/DD")
					break
				case 9:
					// 時刻
					curonSplitData = (dataSplitterByCuron(commaSplitData[i])[1])
					break
				case 10:
				//
					curonSplitData = parseFloat(dataSplitterByCuron(commaSplitData[i])[1]).toFixed(2)
					break
				case 11:
					// 目的ほうさち
					curonSplitData = parseFloat(dataSplitterByCuron(commaSplitData[i])[1]).toFixed(2)
					break
				case 12:
					// ミスと制御
					curonSplitData = parseInt(dataSplitterByCuron(commaSplitData[i])[1])
					break
				case 13:
					//　ファン１
					curonSplitData = parseInt(dataSplitterByCuron(commaSplitData[i])[1])
					break
				case 14:
					// D:予備１
					curonSplitData = dataSplitterByCuron(commaSplitData[i])[1]
					break
				case 15:
					// E:予備2 (fan)
					curonSplitData = dataSplitterByCuron(commaSplitData[i])[1]
					break
				case 16:
					// F:予備3 
					curonSplitData = dataSplitterByCuron(commaSplitData[i])[1]
					break
				case 17:
					// G:左右カーテン 
					curonSplitData = dataSplitterByCuron(commaSplitData[i])[1]
					break
				case 18:
					// H:左右ビニール
					curonSplitData = dataSplitterByCuron(commaSplitData[i])[1]
					break
				case 19:
					// I: 左右天丼カーテン
					curonSplitData = dataSplitterByCuron(commaSplitData[i])[1]
					break
				case 20:
					// Z:チェックサム
					curonSplitData = commaSplitData[i].slice(1,3)	// Remove Z&\r
					break
				default:
					console.log("Data out of range")


			}

			separatedRecvData.push(curonSplitData)
		}
		 console.log("separatedRecvData: ", separatedRecvData)
		return separatedRecvData
	}

}

// return Data in JSON
var separatedDataInJson = function(splittedAllData){
	var serNum = parseInt(splittedAllData[0])
	var outsideNishouData = parseInt(splittedAllData[1])
	var outsideOndoData = parseFloat(splittedAllData[2])
	var outsideSitsudoData = parseFloat(splittedAllData[3])
	var ameData = parseInt(splittedAllData[4])
	var insideOndoData = parseFloat(splittedAllData[5])
	var insideSitsudoData = parseFloat(splittedAllData[6])
	var insideHoshakeiData = parseFloat(splittedAllData[7])
	var hitsuke = splittedAllData[8]
	var jikoku = jikokuFormatChange(splittedAllData[9])
	var housachi = parseFloat(splittedAllData[10])
	var tar_housachi = parseFloat(splittedAllData[11])
	var mist = parseInt(splittedAllData[12])
	var fan1 = parseInt(splittedAllData[13])
	var yobi1 = splittedAllData[14]
	// Gaet fans status
	var yobi2 = splittedAllData[15]	// fans status
	var fansState = fanStatus.getFanStatus(yobi2)
	var fan2 = parseInt(fansState.fan2)
	var fan3 = parseInt(fansState.fan3)
	var fan4 = parseInt(fansState.fan4)
	// End fans status
	var yobi3 = splittedAllData[16]
	var katen = splittedAllData[17]
	var biniiru = splittedAllData[18]
	var tenjoukaten = splittedAllData[19]
	var checksum = splittedAllData[20]

	return {"serNum": serNum,"shoudo": outsideNishouData, "outOndo": outsideOndoData,
		   "outSitsudo": outsideSitsudoData, "ame": ameData,
		   "inOndo": insideOndoData, "inSitsudo": insideSitsudoData,
		   "houshasen": insideHoshakeiData, "hitsuke": hitsuke,
		   "jikoku": jikoku, "housachi": housachi, "tar_housachi": tar_housachi,
		   "mist": mist, "fan1": fan1, "fan2": fan2, "fan3": fan3, 
		   "fan4": fan4,"yobi1": yobi1,"yobi3": yobi3, "katen": katen, "biniiru": biniiru,
		   "tenjoukaten": tenjoukaten, "checksum": checksum
		   }

}

// return data in json style
var returnSeparatedDataInJson = function(data){
	var dataInArray = returnSeparatedDataInArray(data)
	if (!_.isEmpty(dataInArray)) {
		var dataInJson = separatedDataInJson(dataInArray)
		return dataInJson
	}

}


// change jikoku format
var jikokuFormatChange = function(data){
	if(!_.isEmpty(data)){
		var changeData = data.replace("/", ":")
		return changeData
	}
	
}