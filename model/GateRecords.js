const mongoose = require('mongoose');
var Schema = mongoose.Schema;

let gateRecordsSchema = new Schema(
{
	userId:
	{
		type: Number,
		ref: "User",
		required: true
	},
	inDate:
	{
		type: Date,
		default: ""
	},
	outDate:
	{
		type: Date,
		default: ""
	},
	inTime:
	{
		type: String,
		default: ""
	},
	outTime:
	{
		type: String,
		default: ""
	},
	noOfVisitors:
	{
		type: Number,
		default: 0
	},
	forgot:
	{
		type: String,
		default: ""
	}
});

module.exports = mongoose.model("gaterecords", gateRecordsSchema);