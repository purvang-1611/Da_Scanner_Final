const express = require("express");

const User = require("../model/User");
const GateRecords = require("../model/GateRecords");
const TempGateRecords = require("../model/TempGateRecords");

const date = require('date-and-time'); //formate date and time

const gateRouter = express.Router();

gateRouter.get("/loadGateScanner",(request, response, next) =>
{
	response.render("studentViews/GateScanQR",
	{
		title: "DA Gate Entry/Exit System",
		expressFlash: request.flash("success")
	});
});

gateRouter.post("/checkQR",(request, response, next) =>
{
	const userId = request.body.studentId;
	console.log(request.body.mes);
	User.findById(userId,{password:0},(err, user)=>
	{
		if(err)
		{
			console.log("error while fetching user in CheckQR: ");
			console.log(err);
			return response.send("ERROR");
		}
		console.log(userId);
		//console.log(user);
		if(user)
		{
			response.send(user);
		}
		else
		{
			response.send("INVALID");
		}
	});
});

gateRouter.post("/insertRecord",(request, response, next) =>
{
	console.log("inside insertRecord");
	let userId = request.body.studentId;
	User.findById(userId,{password:0},(err, user)=>
	{
		if(err)
		{
			console.log("error while fetching user in CheckQR: ");
			console.log(err);
			return response.send("ERROR");
		}
		
		if(user)
		{
			console.log(user._id);

			const now = new Date();
			let currDate = date.format(now, 'DD-MM-YYYY');
			let currTime = date.format(now, 'HH:mm:ss');

			console.log(request.body.out);
			console.log(request.body.in);

			if(request.body.out)
			{
				console.log(request.body.out);
				let gateRecord = new GateRecords();

				let forgotIn = true;

				gateRecord.userId = user._id;
				gateRecord.outDate = currDate;
				gateRecord.outTime = currTime;
				gateRecord.inDate = currDate;
				gateRecord.inTime = currTime;
				gateRecord.noOfVisitors = 0;

				TempGateRecords.find({userId: user._id}, (err, tempRecord)=>
				{
					console.log(tempRecord);
					console.log(!(tempRecord[0] == undefined));
					if(err)
					{
						console.log("error while fetching tempRecord: ");
						console.log(err);
					}

					if(!(tempRecord[0] == undefined))
					{
						forgotIn = false;
						gateRecord.inDate = tempRecord[0].inDate;
						gateRecord.inTime = tempRecord[0].inTime;
						gateRecord.noOfVisitors = tempRecord[0].noOfVisitors;

						TempGateRecords.deleteOne({userId: user._id})
						.then((result)=>
						{
							console.log("temp record delete for "+ userId);
						})
						.catch((err)=>
						{
							console.log(err);
						});
					}

					if(forgotIn)
					{
						console.log("two out found");
						gateRecord.forgot = "IN";
					}

					gateRecord.save()
					.then(result=>
					{
						console.log("per. record inserted");
						console.log(result);
						response.send("success");
					})
					.catch(err=>
					{
						console.log(err);
						response.send("ERROR");
					});
				});


			}
			else if(request.body.in)
			{
				console.log(request.body.in);

				let newTempRecord = new TempGateRecords();

				newTempRecord.userId = user._id;
				newTempRecord.inDate = currDate;
				newTempRecord.inTime = currTime;
				newTempRecord.noOfVisitors = request.body.noOfVisitors;

				TempGateRecords.find({userId: user._id}, (err, tempRecord)=>
				{
					if(!(tempRecord[0] == undefined))
					{
						console.log("attemp to second time IN");

						let gateRecord = new GateRecords();

						gateRecord.userId = user._id;
						gateRecord.outDate = tempRecord[0].inDate;
						gateRecord.outTime = tempRecord[0].inTime;
						gateRecord.inDate = tempRecord[0].inDate;
						gateRecord.inTime = tempRecord[0].inTime;
						gateRecord.noOfVisitors = tempRecord[0].noOfVisitors;
						gateRecord.forgot = "OUT";

						gateRecord.save()
						.then(result=>
						{
							console.log("Data Saved for previous IN");
						})
						.catch(err=>
						{
							console.log(err);
						});

						TempGateRecords.deleteOne({userId: user._id})
						.exec()
						.then((result)=>
						{
							console.log("one of temp record delete for "+ userId);
						})
						.catch((err)=>
						{
							console.log(err);
						});
					}
				});

				newTempRecord.save()
				.then(result=>
				{
					console.log("Temp recorded");
					console.log(result);

					request.flash("success", "Temp. In Entry recorded successfully");
					response.send("success");
				})
				.catch(err=>
				{
					console.log(err);
					response.send("ERROR");
				});
			}
		}
		else
		{
			response.send("INVALID");
		}
	});	
});

gateRouter.get("/loadGenerateReport",(request, response)=>
{
	response.render("studentViews/GenerateReportForm",
	{
		title: "Generate Report from gate reocrds",
		messages: null
	});
});

gateRouter.post("/generateReport",(request, response)=>
{
	console.log("you are in gate router");
	request.url = "/admin/gateReport";
	request.app.handle(request,response);
	
});

module.exports = gateRouter;