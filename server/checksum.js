// var convertToAscii = function(str) {
// 	var len = str.length
// 	var convertData = str.slice(1,len-2)	// Get 1~len-2 string
// 	var chksum_val = str.slice(len-2,len)	// Get the checksum value

// 	console.log("convertData: ", convertData)
// 	console.log("checksum: ", chksum_val)

// 	var suminInt = 0
// 	var suminHex 
// 	for (var i=0; i<convertData.length; i++) {
// 		// Get each charecter Ascii and convert it to Int and sum it up
// 		suminInt += parseInt(convertData[i].charCodeAt(0), 16)
// 	}
// 	console.log("suminInt: ", suminInt)
// 	// Convert the sum of Int to Hex again
// 	suminHex = suminInt.toString(16)	// 下位8ビット dont know well

// 	console.log("suminHex: ", suminHex)

// 	// compare suminHex & real checksum
// 	if (suminHex === chksum_val) {
// 		console.log(true)
// 		return true;
// 	}else {
// 		console.log(false)
// 		return false;
// 	}

// }

// var string = "N14,0:7529,1:19.57,2:66.41,3:0,4:21.21,5:75.77,6:76,7:17/06/16,8:14/47,9:4.50,A:4.50,B:0,C:0,D:41,E:0,F:0,ZE5"
// convertToAscii(string)


var pi1 = parseInt("04", 16)
var pi1InBi = pi1.toString(2)
console.log("pi1InBi: ", pi1InBi)
var pi2 = parseInt("1C",16)
var pisum = pi1 + pi2
var sumOfHex = pisum.toString(2)
console.log(pi1)
console.log(pi2)
console.log(pisum)
console.log(sumOfHex)