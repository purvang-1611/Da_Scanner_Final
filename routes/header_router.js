const express = require('express');
const router = express.Router();
//this function avoids user ttto generate qr more than  5 times
var user=require('../model/User');

router.get('/',function(req,res,next){

    user.find({_id:req.user._id},function(err,rows){
        if(err)
        {
            res.json(err);
        }
        else
        {
           
            res.send(rows[0].qr_cnt+"");
        }
    })

})



module.exports=router;