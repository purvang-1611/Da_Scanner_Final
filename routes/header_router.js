const express = require('express');
const router = express.Router();
//this function avoids user ttto generate qr more than  5 times
var user=require('../model/User');
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

// CHECKING IF STUDENT IS VALID
router.get('/',loggedin1,function(req,res,next){

    console.log("in header route");
    console.log(req.user);
    user.find({$and: [{_id:req.user._id},{enabled:true}]},function(err,rows){
        if(err)
        {

            res.json(err);
        }
        else
        {
           if(rows.length){
               res.send(""+rows[0].qr_cnt);
           }
           else{
               res.status(500).send("You are Disabled or Alumni");
           }
        }
    })

})



module.exports=router;