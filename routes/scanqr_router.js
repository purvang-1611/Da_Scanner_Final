var express = require('express');
var router = express.Router();
var user_records=require('../model/User');

router.post('/',function(req,res,next){
   
    //console.log("inside router");
    // IF QR IS SCANNED
    if(req.body.status==1)
    {
          //console.log("in QR");
          user_records.findOne({qr_code:req.body.id},function(err,rows){
            if(err)
            {
               //console.log(err);
                res.status(500).send("Qr invalid") 
            }
            else{
                //console.log(rows);
                if(rows)
                {
                   // console.log(rows + "heyyy");
                    let today = new Date();
                    let year = today.getFullYear();
                    if(year <= parseInt(rows.batchYear) && rows.enabled==true){
                        res.send(rows);
                    }
                    else{
                        res.status(500).send("Student is an Alumni or Disabled"); 
                    }
                   
                }
                else{
                    console.log(rows + " heyyy");
                    res.status(500).send("Qr invalid") 
                }
            }
        })
    }
    else
    {
        // IF ID IS ENTERED MANUALLY
        user_records.findOne({$and: [{_id:req.body.id},{userTypeId:5}]},function(err,rows){
            if(err)
            {
                
                res.status(500).send("ID invalid") 
            }
            else{
               // console.log(rows.length);
                if(rows)
                {
                    let today = new Date();
                    let year = today.getFullYear();
                    console.log(rows);
                    console.log(year + " " + rows.batchYear + " " + rows.enabled);
                    if(year <= parseInt(rows.batchYear) && rows.enabled == true){
                        res.send(rows);
                    }
                    else{
                        res.status(500).send("Student is an Alumni or Disabled"); 
                    }
                }
                else{
                    res.status(500).send("ID invalid") 
                }
            }
        })
    }
    
})
module.exports=router;