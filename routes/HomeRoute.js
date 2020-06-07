const express=require('express');
const User = require('../model/User');
//const { check, validationResult } = require('express-validator/check');
//const { matchedData, sanitize } = require('express-validator/filter');
const homeRouter = express.Router();


module.exports = function (passport){

    homeRouter.post("/authUser",passport.authenticate('local',{
        failureRedirect:'/',
        //successRedirect:'/users/loadHomePage',
        failureFlash: ""
    }),(req,res)=>{

        //console.log("cook" + req.cookies['remember_me']);
        if(req.body.rememberme)
        {
            res.cookie("remember_me",req.user,{maxAge: 24*60*60*1000}); //1 DAY cookie
        }
        res.redirect("/users/loadHomePage");
    });

    return homeRouter;

}



/*homeRouter.post("/authUser",(req,res,next) => {

        let userID = req.body.userID;
        let pass= req.body.password;
        console.log(userID);
        console.log(pass);
        User.findById({_id: userID,password: pass},(err,rec) =>{

            if(err)
            {
                console.log(err);
                res.render('HomePage',
                {
                    errors :'Invalid UserID or Password'
                });
            }
            else{
                    console.log(rec);
                    let userType = rec.userTypeId;
                    console.log(userType);
                    const title="Welcome " + rec.fName + " " + rec.lName;
                    if(userType == 1){
                        res.render('adminIndex',{
                            title:title,
                            user : rec //passing user details 
                        });
                    }
                    

            }

        });



});
module.exports=homeRouter;*/

