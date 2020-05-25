const mongoose = require("mongoose");

let courseSchema = new mongoose.Schema(
{
	_id:
	{
		type: String,
		required: true
	},
	course_name:
	{
		type: String,
		required: true
    },
    duration:
    {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Courses", courseSchema);