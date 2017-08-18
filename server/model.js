const mongoose = require("mongoose")
const Schema = mongoose.Schema

const dataMinSchema = new Schema({
	serNum: Number,
	shoudo: Number,
	outOndo: Number,
	outSitsudo: Number,
	ame: Number,
	inOndo: Number,
	inSitsudo: Number,
	houshasen: Number,
	hitsuke: String,
	jikoku: String,
	housachi: Number,
	tar_housachi: Number,
	mist: Number,
	fan1: Number,
	fan2: Number,
	fan3: Number,
	fan4: Number,
	yobi1: String,
	yobi3: String,
	leftKaten: Number,
	rightKaten: Number,
	leftBiniiru: Number,
	rightBiniiru: Number,
	leftTenjouKaten: Number,
	rightTenjouKaten: Number,
	// katen: String,
	// biniiru: String,
	// tenjoukaten: String,
	checksum: String,
	created_at: {type: Date, default: Date.now}
})

// min and ten min data using the same schema
module.exports.dataMinCollection = mongoose.model("dataMinCollection", dataMinSchema)
module.exports.dataTenMinCollection = mongoose.model("dataTenMinCollection", dataMinSchema)
module.exports.data1hourCollection = mongoose.model("data1hourCollection", dataMinSchema)