
const express = require("express");
const crypto = require('crypto');

const User = require("../model/User");
const GateRecords = require("../model/GateRecords");
const TempGateRecords = require("../model/TempGateRecords");

const date = require('date-and-time'); //formate date and time

const gateRouter = express.Router();

var loggedin = function (req,res,next)
{
    // console.log(req.user);
    if(req.isAuthenticated())
    {
        User.find({_id : req.user._id},function(err,rows){
            if(err)
            {
                res.redirect('/');
            }
            else{
                if(rows[0].userTypeId==2)
                {
                    next() // if logged in
                }
                else{
                    res.redirect('/');
                }
            }
        })
        
       
    }
    else if(req.cookies['remember_me']){
		req.user = req.cookies['remember_me'];
		next();
	}             
	else
		res.redirect('/');
}

gateRouter.get("/loadGateScanner",loggedin,(request, response, next) =>
{
	response.render("studentViews/GateScanQR",
	{
		title: "DA Gate Entry/Exit System",
		expressFlash: request.flash("success")
	});
});

gateRouter.post("/checkQR",loggedin,(request, response, next) =>
{
	const id = request.body.studentId;
	var userId = id;
	if(isNaN(id))
	{
		try
		{
			mykey = crypto.createDecipher('aes-128-cbc', 'dascanner');
			var userId = mykey.update(id, 'hex', 'utf8')
			userId += mykey.final('utf8');
		}
		catch(err)
		{
			console.log(err)
			return response.send("INVALID");
		}
	}
	
	console.log(request.body.mes);
	console.log("\nid: "+userId);
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

gateRouter.post("/insertRecord",loggedin,(request, response, next) =>
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

gateRouter.get("/loadGenerateReport",loggedin,(request, response)=>
{
	response.render("GenerateReportForm",
	{
		title: "Generate Report from gate reocrds",
		route: "gate",
		messages: null
	});
});

gateRouter.post("/generateReport",(request, response)=>
{
	console.log("you are in gate router");
	let option = request.body.reportOption;
	console.log(option);

	let today = new Date();
    let yyyy = today.getFullYear();

    today = new Date();
    let fdate  = new Date("2000-01-01");
	let startDate = date.format(fdate, 'DD-MM-YYYY');
	let endDate = date.format(today, 'DD-MM-YYYY');
	console.log(today);
	let startId = "200100000";
	let endId = "999999999";

	if(option == 2 || option == 3)
	{
		startId = request.body.studentId;
		endId = request.body.studentId;
	}

	if(option != 2)
	{
		let sdate  = new Date(request.body.startDate);
		let edate  = new Date(request.body.endDate);

		startDate = date.format(sdate, 'DD-MM-YYYY');
		endDate = date.format(edate, 'DD-MM-YYYY');

		if(startDate > endDate)
		{
			let tempDate = startDate;
			startDate = endDate;
			endDate = tempDate;
		}
	}

	console.log(startDate + " "+ endDate);
	console.log(startId + " "+ endId);
	startId = parseInt(startId, 10);
	endId = parseInt(endId, 10);
	GateRecords.aggregate(([
	{
		"$lookup":
		{
			"from": "users",
			"localField": "userId",
			"foreignField": "_id",
			"as": "gaterecords"
		}
	},
	{
		"$unwind": "$gaterecords"
	},
	{
		"$project":
		{
			"gaterecords.password": 0
		}
	},
	{
		"$match":
		{
			"$and":
			[
				{"$or":[{"outDate": {"$lte": endDate}},
						//{"outDate": {"$lte": endDate}},
						{"outDate":{"$eq": ""}}]},
				{"$or":[{"inDate": {"$gte": startDate}},
						//{"inDate": {"$gte": startDate}},
						{"inDate":{"$eq": ""}}]},
				{"userId": {"$gte": startId}},
				{"userId": {"$lte": endId}}
			]
		}
	}
	]), (err, result)=>
	{
		if(err)
		{
			console.log("error while getting records for Report");
			console.log(err);
		}

		console.log(startDate, endDate);
		if(result.length !== 0)
		{
			response.render("reportViews/DisplayReport",
			{
				title: "Generated Report From Gate Reocrds",
				messages: result,
				startDate: startDate,
				endDate: endDate
			});
		}
		else
		{
			response.render("reportViews/DisplayReport",
			{
				title: "Generated Report From Gate Reocrds",
				messages: "No Data Found",
				startDate: startDate,
				endDate: endDate
			});
		}
	});
	//request.url = "/admin/gateReport";
	//request.app.handle(request,response);
	
});

module.exports = gateRouter;