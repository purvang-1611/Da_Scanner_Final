const localStrat =require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./model/User');
comparePassword = (password,hash)=>
{
	console.log("hey comparing " + password + " " + hash);
	let flag=false;
	flag=bcrypt.compareSync(password,hash);

    return flag;
}
module.exports = function (passport){
    passport.serializeUser(function(user,done){ //add into session
            done(null,user)


    })
    passport.deserializeUser(function(user,done){ //remove from session
            done(null,user);

    })

    passport.use(new localStrat({
        usernameField:'userID',
        passwordField:'password',
        passReqToCallback: true
    },function(req,username,password,done){
        
        User.findById({_id:username},function(err,doc){
            if(err){
                done(err)
                console.log("err" + err);
            }
            else{
                if(!doc){
                    done(null,false,req.flash('message','No User Found'));
                    console.log("not found");
                }
                else{


                    doc.comparePassword(password,function(err,isMatch){
                        if(isMatch)
                        {
                            done(null,doc); 
                        }
                        else{
                            done(null,false,req.flash('message','Password Incorrect'));
                        }
                    })
                    //TODO get encryption working 
                    /*let valid = comparePassword(password,doc.password);
                    //console.log(" hey  " + valid);
                    if(valid)
                    {
                        done(null,doc);
                        console.log("doc" + doc);
                    }
                    else{
                        done(null,false,req.flash('message','Password Incorrect'));
                        console.log(err);
                    }*/
                }
            }

        })
    }))
    //return passport;
}