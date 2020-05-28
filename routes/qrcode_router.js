var express=require('express');
var router=express.Router();
var qr=require('../model/qrcode');
var user=require('../model/User');
const qrimg=require('qr-image');

const fs=require('fs');
var loggedin1 = function (req,res,next)
{
    if(req.cookies['remember_me'] && !req.isAuthenticated()){
        req.user = req.cookies['remember_me'];
    }
    if(req.isAuthenticated() || req.user)
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
	else
		res.redirect('/index');
}


router.get("/",loggedin1,function(req,res,next){

    //console.log("hasdasdeyyyy");
    let id1=req.user._id;
    id1=id1.toString();
   id1=id1+Date.now();
   
  
    user.find({$and: [{_id:req.user._id}, {enabled: true}]},function(err,rows){
        if(err)
       {
           console.log(err);
            res.status(500).send("DB error");
        }
        else
        {
            if(rows.length==1)
            {
                 rows[0].qr_code=id1;
                 rows[0].qr_cnt--;
                 rows[0].save(function(err1,res1){
                     if(err1)
                     {
                         console.log(err1);
                         res.json(err1);
                     }
                     else
                     {
                        qr.generateQR(req.user._id,id1,function(flag){
                            if(!flag)
                            {
                                
                                res.status(500).send("Cannot Generate QR! Please Try Again");
                            }
                            else
                            {
                                res.send("Please Check your email");
                            }
                        });        
                        
                     }
                 })
            }
            else{
                res.status(500).send("You are Disabled or Alumni");
            }
        }
    })


    //res.json({"status":"successful"});
    /*setTimeout(()=>{
        res.redirect('/student_homepage1');
    },1000)*/
    
    
});

module.exports=router;