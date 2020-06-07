const express = require("express");
const bcrypt=require('bcrypt');

//bring user type model
const UserTypes = require("../model/UserTypes"); 
// bring user model
const User = require("../model/User");
const date = require("date-and-time");
const Course = require("../model/Batch");
const qr = require('../model/qrcode');
const library = require('../model/lib_tmp');
var inventory = require('../model/sportsinventory_model');
const userRouter = express.Router();

var loggedin = function (req,res,next)
{
    if(req.cookies['remember_me']){
        req.user = req.cookies['remember_me'];
    }
    if(req.isAuthenticated() || req.user)
    {
		
        User.find({$and : [{_id : req.user._id},{enabled:true}]},function(err,rows){
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
                else if(rows[0].userTypeId==1)
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

// ADD A COURSE TO THE DATABASE
userRouter.post("/addCourse",loggedin,(req,res) =>{

	let cid = req.body.courseID;
	let courseName = req.body.courseName;
	let dur = req.body.duration;
	console.log(cid + dur);
	Course.findById(cid , (err,doc)=>{

		if(err)
		{
			res.status(500).send("Unexpeected error occured");
			console.log("err " +err);
		}
		else if(doc)
		{
			res.status(500).send("Course Already Exists");
			console.log(doc);
		}
		else{

			let course = new Course();

			course._id = cid;
			course.course_name = courseName;
			course.duration=dur;

			course.save().then( result=>{

				//console.log(result);
				res.send("Course Added");
			})
			.catch(err=>{
				res.status(500).send("Database Error ");
				//console.log(err);
			})
			
		}
	})


})

userRouter.post("/updateCourse",loggedin,function(req,res){
	let cid=req.body.id;
	let course_name=req.body.coursename;
	let course_duration=req.body.courseduration;


	Course.updateOne({_id:cid},{$set:{
		course_name:course_name,
		duration:course_duration
	}},function(err,result){

		if(err){
			res.status(500).send("Error updating course");
		}
		if(result){
			res.send("Course Updated");
		}
		else{
			res.send("Course not updated");
		}
	})

	
})

userRouter.post('/deleteCourse',function(req,res){
	Course.deleteOne({_id:req.body.id},function(err,rows){
		if(err){
			res.status(500).send("Error deleting course");
		}
		else{
			res.send("Course deleted");
		}
	})
})

userRouter.get("/",loggedin,(req,res)=>{

	let libRecords;
	library.find((err,libdata)=>{
		if(err){
			res.status(500).send("Error loading DB");
		}
		else{
			libRecords=200-libdata.length;
		}
	})
	let inventoryRecords;
	inventory.find(function (err, inventoryrecord) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            inventoryRecords=inventoryrecord;
        }
	});
	let user = req.user;
	let coursedata;
	Course.find(function (err,rows){
		if(err){
			res.status(500).send(err);
		}
		else{
			
				coursedata=rows;
			
		}
	})
	setTimeout(()=>{
        res.render("adminViews/AdminHome",{
			title: user.fName + " " + user.lName,
			avl_seats: libRecords,
			inventoryData: inventoryRecords,
			coursedata1:coursedata,
			err: ""
		})
    },500)
	

})





// LOADING GENERATE REPORT FORM


userRouter.post("/generateReport",loggedin,(request,response)=>{
   
	let option=request.body.empType;
	console.log(option);
	request.url="/"+option+"/generateReport";
	//next("/"+option+"/generateReport");
	request.app.handle(request,response); //WORKS

});

//ADD Employee User Load
userRouter.get("/addEmpUser",loggedin, (request, response, next) =>
{
	
	UserTypes.find({}, (error, userTypes)=>
	{
		if(error)
		{
			console.log(error);
		}
		else
		{
			//console.log(userTypes);
			response.render("adminViews/EmployeeRegistration",
			{
				title: "Employee Registration",
				userTypes: userTypes,
				data: "",
				errors: null
			});
		}
	});
		
	
});



//ADD Employee User 
userRouter.post("/addEmpUser",loggedin, async (request, response, next) => 
{
		User.findOne({userEmailId:request.body.userEmailId},async (err,doc)=>{
		if(err){
				response.status(500).send('Error occured');

		}
		else if(doc)
		{
				response.status(500).send(' User already exists');

		}
		else{
				try{
					let pass =request.body.userId.toString() + Date.now();
				const hashedPass = await bcrypt.hash(pass,10); //await as async 
		
					console.log(hashedPass);
					let user = new User();
					user._id = request.body.userId;
					user.userEmailId = request.body.userEmailId;
					user.fName = request.body.fName;
					user.lName = request.body.lName;
					user.userTypeId = request.body.userTypeId;
					user.enabled = true;
					//not in emp registration
						//user.courseName = request.body.courseName;
						//user.batchYear = request.body.batchYear;
					user.password = hashedPass;

					user.save()
					.then(result=>
					{
						//console.log(result);
						qr.emailEmployee(request.body.userEmailId,pass);
						response.redirect("/admin/loadAllEmpUsers"); //redirect to all emps
					})
					.catch(err=>
					{
						response.redirect("/admin/addEmpUser"); //redirect to register 
					});
				}catch{
					response.redirect("/admin/addEmpUser");
				}

			}
		});

	//}
});

// DISPLAY STUDENTS INFO
userRouter.get("/loadAllStudents",loggedin,(req,res)=>{
	User.find({userTypeId: {$eq:5}}, (error, students)=>
	{
		if(error)
		{
			console.log(error);
		}
		else
		{
			
			res.render("adminViews/DisplayAllStudents",
			{
				title: "Showing all Students",
				users: students,
				errors: null
			});
		}
	});
})

// RESET STUDENT'S QR COUNT
userRouter.post("/resetStudent/:stuid",loggedin,(req,res)=>{

	let id = req.params.stuid;
	let id1=id;
	id1=id1.toString();
	id1=id1+Date.now();
	//user.qr_code = id1;
	User.findByIdAndUpdate({_id:id},{$set: {qr_cnt: 5 ,qr_code:id1 }},{new:false}, (err,user)=>{
		if(err){
			res.status(500).send("Error updating Info");
		}
		else{
				let err = qr.generateQR(id,id1,(flag)=>{

					if(flag)
					{
						res.send("QR RESET DONE. QR Sent to student's Email.");
					}
					else{
						res.status(500).send("ERROR RESETTING QR");
					}
				});
				
		}
	})

})



// Display all employees
userRouter.get("/loadAllEmpUsers",loggedin, (request, response, next) =>
{
	User.find({userTypeId: {$ne:5}}, (error, emps)=>
	{
		if(error)
		{
			console.log(error);
		}
		else
		{
			
			response.render("adminViews/DisplayAllEmp",
			{
				title: "Showing all Employees",
				users: emps,
				errors: null
			});
		}
	});
});

// ENABLE/DISABLE USERS

userRouter.post('/enableUser',loggedin,(req,res)=>{

	User.findOne({_id:req.body.id},(err,user)=>{
		user.enabled=true;
		user.save(function(err){
			if(err)
			{
				res.status(500).send("Cannot Update User, Database Error");
			}
			else{
				res.send("User Status Updated");
			}
		})
	})
})
userRouter.post('/disableUser',loggedin,(req,res)=>{

	User.findOne({_id:req.body.id},(err,user)=>{
		user.enabled=false;
		user.save(function(err){
			if(err)
			{
				res.status(500).send("Cannot Update User, Database Error");
			}
			else{
				res.send("User Status Updated");
			}
		})
	})
})


userRouter.delete("/delEmp/:userId", (request, response, next)=>
{
	const userId = request.params.userId;
	User.deleteOne({_id: userId})
	.exec()
	.then((result)=>
	{
		response.redirect("/users/loadAllEmpUsers");
	})
	.catch((err)=>
	{
		console.log(err);
		response.redirect("/users/loadAllEmpUsers");
	});
});
module.exports = userRouter;

