var express = require('express');
var router = express.Router();
var equipment = require('../model/equipment');
var inventory = require('../model/sportsinventory_model');
var sacrecords = require('../model/SacRecords_model');
var mail_equ=require('../model/mail_equipment');
var user=require('../model/User');
const date = require('date-and-time');




//This function checks 
//whether authenticated user  is logged in or not 
var loggedin1 = function (req,res,next)
{
    if(req.cookies['remember_me']){
        req.user = req.cookies['remember_me'];
    }
    if(req.isAuthenticated() || req.user)
    {
        user.find({_id : req.user._id},function(err,rows){
            if(err)
            {
                res.redirect('/');
            }
            else{
                if(rows[0].userTypeId==5)
                {
                    next() // if logged in
                }
                else{
                    res.redirect('/');
                }
            }
        })
       
    }
	else
		res.redirect('/');
}



var loggedin = function (req,res,next)
{
    // console.log(req.user);
    if(req.cookies['remember_me']){
        req.user = req.cookies['remember_me'];
    }
    if(req.isAuthenticated() || req.user)
    {
        user.find({$and : [{_id : req.user._id},{enabled:true}]},function(err,rows){
            if(err)
            {
                res.redirect('/');
            }
            else{
                if(rows.length==0){
                    console.log("asdasd");
                    req.flash('message','Invalid User (You are disabled or not logged IN)');
                    res.redirect('/');
                }
                else if(rows[0].userTypeId==3)
                {
                    next() // if logged in
                }
                else{
                    console.log("asdasd");
                    req.flash('message','Invalid User (You are disabled or not logged IN');
                    res.redirect('/');
                }
            }
        })
        
       
    }
	else
		res.redirect('/');
}

// Check logged in for report
var loggedinReport = function (req,res,next)
{
    if(req.cookies['remember_me']){
        req.user = req.cookies['remember_me'];
    }
    if(req.isAuthenticated())
    {
       
        user.find({_id : req.user._id},function(err,rows){
            if(err)
            {
                res.redirect('/');
            }
            else{
                if(rows.length==0){
                    //console.log("Enabled false");
                    req.flash('message','Invalid User (You are disabled or not logged IN)');
                    res.redirect('/');
                }
                else if(rows[0].userTypeId==3 || rows[0].userTypeId ==1)
                {
					//console.log("correct");
                    next() // if logged in
                }
                else{
                    //console.log("Invalid");
                    req.flash('message','Invalid User (You are disabled or not logged IN');
                    res.redirect('/');
                }
            }
        })
       
    }   
	else
		res.redirect('/');
}


// LOAD SAC HOME PAGE
router.get("/",loggedin,(req,res)=>{    
inventory.find(function (err, inventoryrecord) {
    if (err) {
        res.send(err);
    }
    else {
        res.render('equipment_views/equipment_borrow', { data: { stock: inventoryrecord }});
        //res.json(inventoryrecord);
    }
});
})

//This router will fetch the records and send to inventory 
//details page for updating qty of equipment and for displaying inventory table 
router.get("/inventory",loggedin,function(req,res,next){
    inventory.find(function(err,inventoryrecord){
        if(err){
            return res.send(err);
        }
       
        res.render('equipment_views/inventory_detail',{data:{stock:inventoryrecord}});
    });
});

// Adding stock to inventory
router.post("/inventory",loggedin,function(req,res,next){
   
    //add new stock
    const data=new inventory({
        name:req.body.itemName,
        NumberOfItems:req.body.totalQuantity,
        NumberOfAvailable:req.body.totalQuantity,
        NumberOfDefects:0
    });
   data.save(function(err,result)
   {
        if(err)
            return res.send(err);
        else{
            //redirect to the page with updated data.
            res.redirect('/equipment/inventory');
    }
    });
});
//

//updates qty and redirects to inventory page
router.post("/inventory/updatestock",loggedin,function(req,res,next){
    //console.log(req);
    //update stock
    console.log(req.body.ch_radio);
    if(req.body.ch_radio=="Qty")
    {
    //this function will add qty to number of available as well as in no of items
    inventory.updateOne({_id:req.body.equipmentID},{$inc:{NumberOfAvailable:req.body.quantity,NumberOfItems:req.body.quantity}},function(err,result){
        if(err)
            return res.send(err);
        else{
            res.redirect('/equipment/inventory');
        
    }
    });
    }
    else if(req.body.ch_radio=="Rpr")
    {
        //This function will  add qty to no of available and will deduct the same amount from defects coloumn 
        inventory.updateOne({_id:req.body.equipmentID},{$inc:{NumberOfAvailable:req.body.Repair,NumberOfDefects:-req.body.Repair}},function(err,result){
            if(err)
                return res.send(err);
            else{
                res.redirect('/equipment/inventory');
            
        }
        });
    }
    else
    {
        //This function will  deduct qty from no of available and will add the same amount to defects coloumn
        inventory.updateOne({_id:req.body.equipmentID},{$inc:{NumberOfDefects:req.body.Defects,NumberOfAvailable:-req.body.Defects}},function(err,result){
            if(err)
                return res.send(err);
            else{
                res.redirect('/equipment/inventory');
            
        }
        });
    }
});



//this router will be used for fetching paricular student's equipment borrower history
router.get('/borrow_history',loggedin1,function(req,res,next){
    let stu_id=req.user._id;
    console.log(req.user._id);
    console.log(stu_id);
    sacrecords.aggregate([
        { $match: { student_id: stu_id } },
        {
            $lookup:
            {
                from:"inventory_records",
                localField:"equipment_id",
                foreignField:"_id",
                as:"equipment_borrows"
            }
        }
     ],function(err1,rows1){
         if(err1)
         {
             res.json(err1);
         }
         else
         {
           
             //res.json(rows1);
             equipment.aggregate([
                { $match: { student_id: stu_id } },
                {
                    $lookup:
                    {
                        from:"inventory_records",
                        localField:"equipment_id",
                        foreignField:"_id",
                        as:"equipment_borrows"
                    }
                }
             ],function(err2,rows2){
                 if(err2){
                     res.json(err2);
                 }
                 else{

                    for(var i=0;i<rows2.length;i++){
                        rows2[i].issue_date = rows2[i].issue_date.toDateString();
                    }
                    for(var i=0;i<rows1.length;i++){
                        rows1[i].issue_date = rows1[i].issue_date.toDateString();
                        rows1[i].return_date = rows1[i].return_date.toDateString();
                    }
                    console.log(rows2 + " HEY");
                     //res.json(rows2);
                     
                        res.render('student_views/student_borrower_history',{
                            sac_records:rows1,
                            pending_records:rows2
                        
                     })
                    
                 }
             })
         }
     })

})


//this router performs following functionality
/*
1)When user comes for issuing any equipment then if the requesting equipment is there than it will be given to that student and also mail is sent saying when to return for penalty purposes.
2)When same user come 2 time then he/she must have to return that earlier borrowed equipment if he wants tthe same equipment which is not returned by him then it will not be given to him/her 
3)else if he wants to return then loan is calculatted and that entry is been done in records for later purposes.


*/

router.post("/issue/:equipmentID?/:studentID?/:quantity?",loggedin,(req,res)=>{

    equipment.find({ student_id: req.params.studentID, equipment_id: req.params.equipmentID }, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else{
            //already borrowed , dont allow
            if(rows.length>0){
                res.status(500).send("Equiment is already Borrowed");
            }
            else{
                var x =new Date();
                   
                const equi = new equipment({
                    equipment_id: req.params.equipmentID,
                    student_id: req.params.studentID,
                    issue_date: date.format(x, 'YYYY-MM-DD'),
                    quantity: req.params.quantity


                });

                equi.save((err,result)=>{
                    mail_equ.sendMail(equi);
                           
                                inventory.updateOne({_id:result.equipment_id},{$inc:{NumberOfAvailable:-result.quantity}},function(err,result){
                                    if(err){
                                        console.log(err);
                                        res.status(500).send(err);
                                        res.redirect('/equipment');
                                    }
                                    else{
                                        res.send("Equipment Borrowed");
                                    }
                                });
                })
            }
        }

})
})

router.post("/return/:equipmentID?/:studentID?/:quantity?",loggedin,(req,res)=>{
    let l_amount=0;
    equipment.find({ student_id: req.params.studentID, equipment_id: req.params.equipmentID }, function (err, rows) {
        if (err) {
            res.json(err);
        }
        else{
            //already borrowed , dont allow
            if(rows.length==0){
                res.status(500).send("Equiment is not Borrowed");
            }
            else{
               
                let tot_qty = rows[0].quantity;
                let issued_date = rows[0].issue_date;
                issued_date = new Date(issued_date);
                let today = new Date();
               // issued_date = issued_date;
                //today = date.format(today,"");
                let diff= today.getTime() - issued_date.getTime();
                 diff = diff/(1000*3600*24);
                if(diff> 7 )
                {
                    l_amount = diff * 5 * req.params.quantity;
                }
                const sac1 = new sacrecords({
                    equipment_id: rows[0].equipment_id,
                    student_id: rows[0].student_id,
                    issue_date: issued_date,
                    quantity:req.params.quantity,
                    return_date: date.format(today,"YYYY-MM-DD"),
                    loan: l_amount



                });
                sac1.save(function (err, result) {
                    if (err) {
                        res.json(err);
                    }
                    else {
                        //res.json(result);
                        //console.log(result);
                        inventory.updateOne({_id:result.equipment_id},{$inc:{NumberOfAvailable:req.params.quantity}},function(err,result){
                            if(err)
                                res.json(err);
                                else{
                                    if(tot_qty-req.params.quantity<=0)
                                    {
                                    equipment.deleteOne({ student_id: req.params.studentID, equipment_id: req.params.equipmentID }, function (err, result) {
                                    if (err) {
                                        res.json(err);
                                    }
                                    else {
                                        
                                        console.log("loan amount : "+l_amount.toString());
                                        res.send(l_amount.toString());
                                        
                                        
                                        
                                    }
                                });
                            }
                            else{
                                equipment.updateOne({ student_id: req.params.studentID, equipment_id: req.params.equipmentID },{$inc:{quantity:-req.params.quantity}},function(err,rows){
                                    if(err)
                                    {
                                        res.json(err);
                                    }
                                    else
                                    {
                                        
                                            console.log("loan amount : "+l_amount.toString());
                                             res.send(l_amount.toString());
                                        
                                    }
                                })
                            }
                            }
                        });
                    
                       
                        
                    }
                });
               
            }
        }
})
});


router.post("/generateReport",loggedinReport,(request, response)=>
{
	console.log("you are in gate router");
	let option = request.body.reportOption;
	console.log(option);

	let today = new Date();
    let yyyy = today.getFullYear();

    today = new Date();
    let fdate  = new Date("2000-01-01");
	let startDate =fdate;
	let endDate = today;
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
		 startDate  = new Date(request.body.startDate);
		endDate  = new Date(request.body.endDate);

		//startDate = date.format(sdate, 'DD-MM-YYYY');
		//endDate = date.format(edate, 'DD-MM-YYYY');

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
    let sac_records = {};
    let currentlyBorrowed = {};
	sacrecords.aggregate(([
	{
        //JOINING USER TABLE FOR USER DATA
		"$lookup":
		{
			"from": "users",
			"localField": "student_id",
			"foreignField": "_id",
			"as": "user_records"
		}
    },
    {
		"$unwind": "$user_records"
	},
    {
     //JOINING INVENTORY TABLE   
		"$lookup":
		{
			"from": "inventory_records",
			"localField": "equipment_id",
			"foreignField": "_id",
			"as": "inventory_records"
		}
    },
	{
		"$unwind": "$inventory_records"
	},
	{
		"$project":
		{
			"user_records.password": 0
		}
	},
	{
		"$match":
		{
			"$and":
			[
				{"$or":[{"return_date": {"$lte": endDate}},
						//{"outDate": {"$lte": endDate}},
						{"return_date":{"$gte": startDate}}]},
				{"$and":[{"issue_date": {"$gte": startDate}},
						//{"inDate": {"$gte": startDate}},
						{"issue_date":{"$lte": endDate}}]},
				{"student_id": {"$gte": startId}},
				{"student_id": {"$lte": endId}}
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
            /*console.log(result);
			response.render("reportViews/DisplaySACReport",
			{
				title: "Generated Report From SAC Reocrds",
				messages: result,
				startDate: startDate,
				endDate: endDate
            });*/
            for(var i=0;i<result.length;i++){
                
                result[i].issue_date = result[i].issue_date.toDateString();
                result[i].return_date =result[i].return_date.toDateString();
            }
            sac_records=result;
           
            console.log("HEYYYYYY");
            console.log(sac_records);
		}
		else
		{
			/*response.render("reportViews/DisplayReport",
			{
				title: "Generated Report From SAC Reocrds",
				messages: "No Data Found",
				startDate: startDate,
				endDate: endDate
            });*/
            sac_records=null;
            console.log("not OGT")
		}
    });

    // QUERYING CURRENTLY BORROWED RECORDS
    console.log("HEYYYYYY11111");
    console.log(sac_records);
    equipment.aggregate(([
        {
            //JOINING USER TABLE FOR USER DATA
            "$lookup":
            {
                "from": "users",
                "localField": "student_id",
                "foreignField": "_id",
                "as": "user_records"
            }
        },
        {
            "$unwind": "$user_records"
        },
        {
         //JOINING INVENTORY TABLE   
            "$lookup":
            {
                "from": "inventory_records",
                "localField": "equipment_id",
                "foreignField": "_id",
                "as": "inventory_records"
            }
        },
        {
            "$unwind": "$inventory_records"
        },
        {
            "$project":
            {
                "user_records.password": 0
            }
        },
        {
            "$match":
            {
                "$and":
                [
                    {"$and":[{"issue_date": {"$gte": startDate}},
                            //{"inDate": {"$gte": startDate}},
                            {"issue_date":{"$lte": endDate}}]},
                    {"student_id": {"$gte": startId}},
                    {"student_id": {"$lte": endId}}
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
    
           // console.log(startDate, endDate);
            if(result.length !== 0)
            {
                for(var i=0;i<result.length;i++){
                    result[i].issue_date=  result[i].issue_date.toDateString();
                }
                // WILL RENDER BEFORE ALL DATA IS GOT SO SET TIMEOUT
                setTimeout(()=>{
                    response.render("reportViews/DisplaySACReport",
                    {
                        title: "Generated Report From SAC Records",
                        sac_records: sac_records,
                        temp_records: result,
                        startDate: startDate==fdate ? 0 : startDate.toDateString(),
                        endDate: endDate.toDateString(),
                        id: endId,

                    });

                },1000);
               
                
            }
            else
            {
                setTimeout(()=>{
                    response.render("reportViews/DisplaySACReport",
                    {
                        title: "Generated Report From SAC Records",
                        sac_records: sac_records,
                        temp_records: result,
                        startDate: startDate==fdate ? 0 : startDate.toDateString(),
                        endDate: endDate.toDateString(),
                        id: endId
                    });

                },500);
            }
        });
    

	//request.url = "/admin/gateReport";
	//request.app.handle(request,response);
	
});


router.get("/issuedEquipments",loggedin,(req,res)=>{
    equipment.aggregate(([
        {
            //JOINING INVENTORY TABLE   
               "$lookup":
               {
                   "from": "inventory_records",
                   "localField": "equipment_id",
                   "foreignField": "_id",
                   "as": "inventory_records"
               }
           },
           {
               "$unwind": "$inventory_records"
           }
    ])).exec((err,doc)=>{
        if(err)
        {
            res.status(500).send(err);
        }
        else{
            let equips=[];
            if(doc){
                
              
                for(d of doc){
                    
                    let return_date = d.issue_date;
                    let issue_date = d.issue_date.toDateString();
                    console.log(return_date + " " + issue_date);
                    //x = x.split('-');
                    return_date.setDate(return_date.getDate() + 7);
                    // let dat_obj = new Date(x[2],x[1]-1,x[0]);
                    // dat_obj=new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate()+7);
                    // let return_date=date.format(dat_obj,"DD-MM-YYYY");
                    // //d.issue_date = date.format(d.issue_date,"DD-MM-YYYY");
                    console.log(return_date + " " + issue_date);
                    d.issue_date = issue_date;
                    d.return_date=return_date.toDateString();
                   
                    equips.push(d);
                }
                setTimeout(()=>{
                    console.log("hey");
                    res.render("equipment_views/issuedEquipments",{
                        data: equips,
                        msg: ""
                    })
                },1000);
            }
            else{
                setTimeout(()=>{
                    res.render("equipment_views/issuedEquipments",{
                        data: equips,
                        msg: "No Equipments Borrowed"
                    })
                },1000);
            }
        }
    })
})
 module.exports = router;



