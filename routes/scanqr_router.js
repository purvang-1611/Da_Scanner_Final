var express = require('express');
var router = express.Router();
var user_records=require('../model/User');

router.post('/',function(req,res,next){
   
    console.log("inside router");
    if(req.body.status==1)
    {
          user_records.find({qr_code:req.body.id},function(err,rows){
            if(err)
            {
               console.log(err);
                res.status(500).send("Qr invalid") 
            }
            else{
                console.log(rows);
                if(rows.length==1)
                {
                    res.send(rows);
                }
                else{
                    res.status(500).send("Qr invalid") 
                }
            }
        })
    }
    else
    {
        user_records.find({_id:req.body.id},function(err,rows){
            if(err)
            {
                
                res.status(500).send("Qr invalid") 
            }
            else{
                if(rows.length==1)
                {
                    res.send(rows);
                }
                else{
                    res.status(500).send("Qr invalid") 
                }
            }
        })
    }
    
})
module.exports=router;