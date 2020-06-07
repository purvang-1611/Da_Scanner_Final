const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
let userSchema = new mongoose.Schema(
{
	_id:
	{
		type: Number,
		required: true
	},
	userTypeId:
	{
		type: Number,
		ref: "UserTypeId",
		required: true
	},
	userEmailId:
	{
		type: String,
		required: true
	},
	fName:
	{
		type: String,
		required: true
	},
	lName:
	{
		type: String,
		required: true
	},
	courseName:
	{
		type: String,
		required: false
	},
	batchYear:
	{
		type: String,
		required: false
	},
	password:
	{
		type: String,
		required: true
	},
	qr_code:
	{
		type:String,
		required: false
	},
	enabled: Boolean,
	qr_cnt:
	{
		type:Number,
		required: false
    },
    resetPasswordToken: String,
  	resetPasswordExpires: Date
});


  userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
	  if (err) return cb(err);
	  cb(null, isMatch);
	});
  };


 module.exports = mongoose.model("user_temp", userSchema);