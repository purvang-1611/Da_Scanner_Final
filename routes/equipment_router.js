var express = require('express');
var router = express.Router();
var equipment = require('../model/equipment');
var inventory = require('../model/sportsinventory_model');
var sacrecords = require('../model/SacRecords_model');
var mail_equ=require('../model/mail_equipment');
var user=require('../model/User');
const date = require('date-and-time');

//This function checks 
//whether authenticated student
// is logged in or not 
var loggedin1 = function (req,res,next)
{
 
    if(req.isAuthenticated())
    {
        user.find({_id : req.user._id},function(err,rows){
            if(err)
            {
                res.redirect('/index');
            }
            else{
                if(rows[0].userTypeId==5)
                {
                    next() // if logged in
                }
                else{
                    res.redirect('/index');
                }
            }
        })
       
    }
    else if(req.cookies['remember_me']){
		req.user = req.cookies['remember_me'];
		next();
	}      
	else
		res.redirect('/index');
}

//This function checks 
//whether authenticated sac user
// is logged in or not 

var loggedin = function (req,res,next)
{
    // console.log(req.user);
    if(req.isAuthenticated())
    {
        user.find({_id : req.user._id},function(err,rows){
            if(err)
            {
                res.redirect('/');
            }
            else{
                if(rows[0].userTypeId==3)
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
    let stu_id=req.user._id.toString();
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


                    console.log(rows2);
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
router.get("/:equipmentID?/:studentID?/:quantity?",loggedin,function (req, res, next) {
    console.log("heyyyyyy");
    let l_amount;
    if(req.params.equipmentID && req.params.studentID && req.params.quantity)
    {
        //console.log(req.params.equipmentID);
        //console.log(req.params.studentID);
        //console.log(req.params.quantity);
        equipment.find({ student_id: req.params.studentID, equipment_id: req.params.equipmentID }, function (err, rows) {
            if (err) {
                res.json(err);
            }
            else {
                if (rows.length == 0) {
                    var x =new Date();
                   
                    const equi = new equipment({
                        equipment_id: req.params.equipmentID,
                        student_id: req.params.studentID,
                        issue_date: date.format(x, 'DD-MM-YYYY'),
                        quantity: req.params.quantity
    
    
                    });
                    //console.log(equi);
                    equi.save(function (err, result) {
                        if (err) {
                            res.json(err);
                        }
                        else {
                            //res.json(result);
                            /*var data={
                                "id":req.body.studentID,
                                "equipment":req.body.equipmentID,
                                "Quantity":req.body.quantity,
                                "return_date":new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate()+7)
                            };*/
                           mail_equ.sendMail(equi);
                           
                                inventory.updateOne({_id:result.equipment_id},{$inc:{NumberOfAvailable:-result.quantity}},function(err,result){
                                    if(err)
                                        res.json(err);
                                        res.redirect('/equipment');
                                });
                        }
                    });
                }
                else {
                    //console.log("record is already there");
                    //console.log(rows);
                    let tot_qty=rows[0].quantity;
                    var x = Date.now();
                    var dat_obj=new Date(x);
                    var now=new Date();
                    var dat_obj2=date.format(now, 'DD-MM-YYYY');

                    //quantity aema hase j so eno use karine loan nu karje
                    //console.log(dat_obj-rows[0].issue_date);
    
                    var dat_obj1 = rows[0].issue_date;
                    var d1=Number(dat_obj1.substr(0,2));
                    var d2=Number(dat_obj2.substr(0,2));
                    var m1=Number(dat_obj1.substr(3,2));
                    var m2=Number(dat_obj2.substr(3,2));
                    var y1=Number(dat_obj1.substr(6,4));
                    var y2=Number(dat_obj2.substr(6,4));
                    console.log(d1+"/"+m1+"/"+y1);
                    console.log(d2+"/"+m2+"/"+y2);

                    var date_var=new Date(y1,m1,d1);
                    var date_var1=new Date(y2,m2,d2);
                    console.log(date_var);
                    console.log(date_var1);
                
                    const diffTime = Math.abs(date_var1 - date_var);
                    var loan1 = 0;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log("diff Days : "+diffDays);
                    


                    if (diffDays > 7) {
                        loan1 = (diffDays - 7) * 5 *req.params.quantity;
                        l_amount=loan1;

                    }
                    const sac1 = new sacrecords({
                        equipment_id: rows[0].equipment_id,
                        student_id: rows[0].student_id,
                        issue_date: rows[0].issue_date,
                        quantity:req.params.quantity,
                        return_date: date.format(now, 'DD-MM-YYYY'),
                        loan: loan1
    
    
    
                    });
                   // console.log(sac1);
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
    }
    else
    {
        // LOADING HOME PAGE EQUIPMENT

        inventory.find(function (err, inventoryrecord) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('equipment_views/equipment_borrow', { data: { stock: inventoryrecord }});
            //res.json(inventoryrecord);
        }
    });
}
});


// router.get('/',function(req,res,next){
//     inventory.find(function(err,inventoryrecord){
//         if(err){
//             res.send(err);
//         }
//         else{
//             console.log(inventoryrecord);
//             res.render('equipment_details',{data:{result:inventoryrecord}});
//         }
//     });
// });








// router.post('/',loggedin, function (req, res, next) {
//     console.log("heyyyy");
//     equipment.find({ student_id: req.body.studentID, equipment_id: req.body.equipmentID }, function (err, rows) {
//         if (err) {
//             res.json(err);
//         }
//         else {
//             if (rows.length == 0) {
//                 var x = new Date();
                
//                 const equi = new equipment({
//                     equipment_id: req.body.equipmentID,
//                     student_id: req.body.studentID,
//                     issue_date: date.format(x, 'DD-MM-YYYY'),
//                     quantity: req.body.quantity


//                 });
               
//                 equi.save(function (err, result) {
//                     if (err) 
//                     {
//                         res.json(err);
//                     }
//                     else {
//                         //res.json(result);
//                         /*var data={
//                             "id":req.body.studentID,
//                             "equipment":req.body.equipmentID,
//                             "Quantity":req.body.quantity,
//                             "return_date":new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate()+7)
//                         };*/
//                        mail_equ.sendMail(equi);
                       
//                             inventory.updateOne({_id:result.equipment_id},{$inc:{NumberOfAvailable:-result.quantity}},function(err,result){
//                                 if(err)
//                                     res.json(err);
//                                     res.redirect('/equipment');
//                             });
//                     }
//                 });
//             }
//             else {
           
//                 let tot_qty=rows[0].quantity;
//                 var x = Date.now();
//                 var dat_obj = new Date(x);
//                 var now=new Date();
//                 //quantity aema hase j so eno use karine loan nu karje
//                 //console.log(dat_obj-rows[0].issue_date);

//                 var dat_obj1 = new Date(rows[0].issue_date);
//                 const diffTime = Math.abs(dat_obj - dat_obj1);
//                 var loan1 = 0;
//                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//                 if (diffDays > 7) {
//                     loan1 = (diffDays - 7) * 5 *req.body.quantity;
//                 }
//                 const sac1 = new sacrecords({
//                     equipment_id: rows[0].equipment_id,
//                     student_id: rows[0].student_id,
//                     issue_date: rows[0].issue_date,
//                     quantity:req.body.quantity,
//                     return_date: date.format(now, 'DD-MM-YYYY'),
//                     loan: loan1



//                 });
//                // console.log(sac1);
//                 sac1.save(function (err, result) {
//                     if (err) {
//                         res.json(err);
//                     }
//                     else {
//                         //res.json(result);
                     
//                         inventory.updateOne({_id:result.equipment_id},{$inc:{NumberOfAvailable:req.body.quantity}},function(err,result){
//                             if(err)
//                                 res.json(err);
//                                 else{
//                                     if(tot_qty-req.body.quantity<=0)
//                                     {
//                             equipment.deleteOne({ student_id: req.body.studentID, equipment_id: req.body.equipmentID }, function (err, result) {
//                                     if (err) {
//                                         res.json(err);
//                                     }
//                                     else {
//                                         res.redirect('/equipment');
                                        
//                                     }
//                                 });
//                             }
//                             else{
//                                 equipment.updateOne({ student_id: req.body.studentID, equipment_id: req.body.equipmentID },{$inc:{quantity:-req.body.quantity}},function(err,rows){
//                                     if(err)
//                                     {
//                                         res.json(err);
//                                     }
//                                     else
//                                     {
//                                         res.redirect('/equipment');
//                                     }
//                                 })
//                             }
//                             }
//                         });
                    
                       
                        
//                     }
//                 });
//             }
//         }
//     })
// })

// router.put('/:id', function (req, res, next) {
//     equipment.findById(req.params.id, function (err, docs) {
//         console.log(docs);
//         if (err) {
//             res.json(err);
//         }
//         else {
//             //res.json(docs);
//             docs.equipment_id = req.body.equipment_id;
//             docs.student_id = req.body.student_id;
//             docs.issue_date = req.body.issue_date;
//             docs.return_date = req.body.return_date;
//             docs.loan = req.body.loan;

//             docs.save(function (err1, res1) {
//                 if (err1) {
//                     res.json(err1);
//                 }
//                 else {
//                     res.json(res1);
//                 }
//             });

//         }
//     });
// });



// router.delete('/:id', function (req, res, next) {
//     equipment.deleteOne({ _id: req.params.id }, function (err, result) {
//         if (err) {
//             res.json(err);
//         }
//         else {
//             res.json(result);
//         }
//     })
// });

 module.exports = router;



