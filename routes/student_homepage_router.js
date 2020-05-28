const express = require('express');
const router = express.Router();
const inventory = require('../model/sportsinventory_model');
const library = require('../model/lib_tmp');
var user=require('../model/User');

var loggedin = function (req,res,next)
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
    else if(req.cookies['remember_me'] && !req.user){
		req.user = req.cookies['remember_me'];
		next();
	}           
	else
		res.redirect('/index');
}


router.get('/',loggedin,function(req,res,next){
    inventory.find(function(err,rows){
        if(err)
        {
            res.json(err);
        }
        else
        {
            library.find(function(err1,rows1){

                if(err1)
                {
                    res.json(err1);
                }
                else
                {

                    
                    // console.log(rows1);
                    let x=200-rows1.length;
                
                    //res.json(x);
                    res.render('student_views/student_homepage',{
                        abl_seats:x,
                        inventories:rows,
                        student_id:req.user._id
                    })
                }

            });
        }
    })
})

module.exports=router;