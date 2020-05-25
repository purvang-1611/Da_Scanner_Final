const express = require("express");
const bcrypt=require('bcrypt');

//bring user type model
const UserTypes = require("../model/UserTypes"); 
// bring user model
const User = require("../model/User");
const date = require("date-and-time");
const sac_records = require("../model/sacRecords");
const lib_records = require("../model/libRecords.js");
const GateRecords = require("../model/GateRecords");
const TempGateRecords = require("../model/TempGateRecords");


const router = express.Router();

router.post("/sacReport",(request,response) =>{

    
    let option = request.body.reportOption;
	console.log(option);

	let today = new Date();
    let yyyy = today.getFullYear();

    today = new Date();
    let fdate  = new Date("2002-01-01");
	let startDate = date.format(fdate, 'DD-MM-YYYY');
	let endDate = date.format(today, 'DD-MM-YYYY');
	console.log(today);
	let startId = "200201001";
	let endId = yyyy + "13" + "130";

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

		if(startDate < endDate)
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
	sac_records.aggregate(([
	{
		"$lookup":
		{
			"from": "Users",
			"localField": "userID",
			"foreignField": "_id",
			"as": "sacRecords"
		}
	},
	{
		"$unwind": "$sacRecords"
	},
	{
		"$project":
		{
			"sacRecords.password": 0
		}
	},
	{
		"$match":
		{
			"$and":
			[
				{"$or":[{"return_date": {"$lte": endDate}},
						//{"outDate": {"$lte": endDate}},
						{"return_date":{"$eq": ""}}]},
				{"$or":[{"issue_date": {"$gte": startDate}},
						//{"inDate": {"$gte": startDate}},
						{"issue_date":{"$eq": ""}}]},
				{"userID": {"$gte": startId}},
				{"userID": {"$lte": endId}}
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
			response.render("studentViews/DisplayReport",
			{
				title: "Generated Report From SAC Reocrds",
				messages: result,
				startDate: startDate,
				endDate: endDate
			});
		}
		else
		{
			response.render("studentViews/DisplayReport",
			{
				title: "Generated Report From SAC Reocrds",
				messages: "No Data Found",
				startDate: startDate,
				endDate: endDate
			});
		}
	});

})

router.post("/rcReport",(request,response) =>{

    
    let option = request.body.reportOption;
	console.log(option);

	let today = new Date();
    let yyyy = today.getFullYear();

    today = new Date();
    let fdate  = new Date("2002-01-01");
	let startDate = date.format(fdate, 'DD-MM-YYYY');
	let endDate = date.format(today, 'DD-MM-YYYY');
	console.log(today);
	let startId = "200201001";
	let endId = yyyy + "13" + "130";

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

		if(startDate < endDate)
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
	lib_records.aggregate(([
	{
		"$lookup":
		{
			"from": "Users",
			"localField": "userID",
			"foreignField": "_id",
			"as": "libRecords"
		}
	},
	{
		"$unwind": "$libRecords"
	},
	{
		"$project":
		{
			"libRecords.password": 0
		}
	},
	{
		"$match":
		{
			"$and":
			[
				{"date": {"$lte": endDate}},
				{"date": {"$gte": startDate}},
				{"userID": {"$gte": startId}},
				{"userID": {"$lte": endId}}
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
			response.render("studentViews/DisplayReport",
			{
				title: "Generated Report From RC Reocrds",
				messages: result,
				startDate: startDate,
				endDate: endDate
			});
		}
		else
		{
			response.render("studentViews/DisplayReport",
			{
				title: "Generated Report From RC Reocrds",
				messages: "No Data Found",
				startDate: startDate,
				endDate: endDate
			});
		}
	});

})

router.post("/gateReport",(request,response) =>{

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

		if(startDate < endDate)
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
				{"$or":[{"outDate": {"$gte": endDate}},
						//{"outDate": {"$lte": endDate}},
						{"outDate":{"$eq": ""}}]},
				{"$or":[{"inDate": {"$lte": startDate}},
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
})


