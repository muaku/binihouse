var hex2bi = function(hex) {
	console.log("hex: ", hex)
	// First, convert hex to int
	var hex2int = parseInt(hex, 16)
	console.log("hex2int: ", hex2int)
	// Second, convert int to binary
	var int2bi = hex2int.toString(2)

	console.log("binary: ", int2bi)
	return int2bi
}

// hex2bi("0")

exports.getFanStatus = function(hex) {
	var fan2 = 0
	var fan3 = 0
	var fan4 = 0
	// Convert hex -> binary
	var binary = hex2bi(hex)

	var biLen = binary.length

	if(biLen > 4) {	// 1Ch: 11100  (all fan is ON), 10h: 10000(only fan4 is on)
		fan4 = binary[0]
		fan3 = binary[1]
		fan2 = binary[2]
	}else if(biLen>3) {	// 08h: 1000
		fan4 = 0
		fan3 = binary[0]
		fan2 = binary[1]
	}else if (biLen > 2){	// 04h: 100
		fan4 = 0
		fan3 = 0
		fan2 = binary[0]
	}else{	// 0
		fan4 = 0
		fan3 = 0
		fan2 = 0
	}

	fanData = {"fan2": fan2, "fan3": fan3, "fan4": fan4}
	console.log(fanData)

	return fanData
}

// var biData = hex2bi("14")
// getFanStatus(biData)