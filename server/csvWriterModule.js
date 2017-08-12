var csvWriter = require('csv-write-stream')
var writer = csvWriter()	// { headers: ["照度", "外温度", "外湿度", "雨", "内温度", "内湿度", "放射線"]}
var fs = require("fs")
const os = require("os")

exports.createFile = function(){
	var date = new Date()
	var year = date.getFullYear()
	var month = date.getMonth()　+ 1
	var day = date.getDate()
	var csvFileName = year+"-"+month+"-"+day

	if(os.platform() === "win32"){
		var folder = "C:/Binihouse/"
	}else{	// if not window
		var folder = process.env['HOME'] + "/Documents/"
	}
	
	// Create folder if if not existed
	if(!fs.existsSync(folder)){
		fs.mkdirSync(folder)
	}
	var path = folder + csvFileName

	console.log("path: ", path)
	writer.pipe(fs.createWriteStream(path + ".csv"))
}

exports.write = function(jasonData){
	writer.write(jasonData)
}

