var express=require('express');
var router=express.Router();
var qr=require('../model/qrcode');
var user=require('../model/User');
const qrimg=require('qr-image');

const fs=require('fs');

router.get("/",function(req,res,next){

 
    let id1=req.user._id;
    id1=id1.toString();
   id1=id1+Date.now();
   
  
    user.find({_id:req.user._id},function(err,rows){
        if(err)
       {
            res.json(err);
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
                         res.json(err1);
                     }
                     else
                     {
                        qr.generateQR(req.user._id,id1,function(err){
                            if(err)
                            {
                                res.json(err);
                            }
                            else
                            {
                              
                                
                             
                            }
                        });        
                        
                     }
                 })
            }
        }
    })


    //res.json({"status":"successful"});
    setTimeout(()=>{
        res.redirect('/student_homepage1');
    },1000)
    
    
});

module.exports=router;