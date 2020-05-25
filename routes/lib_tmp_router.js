var express=require('express');
var router=express.Router();
var tmp_lib=require('../model/lib_tmp');
var lib=require('../model/library');
const date = require('date-and-time');
var user=require('../model/User');
var loggedin = function (req,res,next)
{
    if(req.isAuthenticated())
    {
       
        user.find({_id : req.user._id},function(err,rows){
            if(err)
            {
                res.redirect('/');
            }
            else{
                if(rows[0].userTypeId==4)
                {
                    next() // if logged in
                }
                else{
                    res.redirect('/');
                }
            }
        })
       
    }
        
        
	else
		res.redirect('/');
}



router.get('/lib_tmp_out',loggedin,function(req,res,next){
    
   
    tmp_lib.find(function(err,docs){
        if(err)
        {
           
            res.json(err);
        }
        else
        {
           
            //res.json(docs);
            
        
                var i;
                var id1;
                for(i=0;i<docs.length;i++)
                {
                    id1=docs[i].user_id;
                tmp_lib.find({user_id:id1},function(err,docs1){
                 
                    if(err)
                    {
                        res.json(err);
                    }// wait ek min
                    else
                    {
                        //res.json(docs);
                      
            
                        const now = new Date();
                        let curtime=date.format(now,'HH:mm:ss')
                        docs1[0].out_time=curtime;
                        //date:new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate()+1)
                        
                        docs1[0].save(function(err1,res1){
                            if(err1)
                            {
                                res.json(err1);
                            }
                            else
                            {
                                //res.json(res1);
                                    const lib1=new lib({
                                    user_id : docs1[0].user_id,
                                    in_time :docs1[0].in_time,
                                    out_time:docs1[0].out_time,
                                    date:docs1[0].date
                                    
                                   
                                });
                             
                                lib1.save(function(err,result){
                                    if(err)
                                    {
                                        res.json(err);
                                    }
                                    else{
                                        //res.json(result);


                                       
                                        tmp_lib.deleteOne({user_id:lib1.user_id},function(err,result){
                                            if(err)
                                            {
                                                res.json(err);
                                            }
                                            else
                                            {
                                                //res.json(result);
                                               
                                                //res.redirect('/lib_tmp');
                                            }
                                        })
                                    







                                    }
                                });
                                



                            }
                        });
            
                    }
                });



            }
            
        }
       
     
        setTimeout(()=>{res.redirect('/lib_tmp')}, 1000); 
    });

   
});




router.get('/:id?',loggedin,function(req,res,next){
    if(req.params.id)
    {
    const id1=req.params.id;
    tmp_lib.find({user_id:req.params.id},function(err,docs){
        if(err)
        {
          
            res.json(err);
        }
        else
        {
         
            //res.json(docs);
            if(docs.length==0){
                // res.json(docs);
             
                var x=Date.now();
                //x=Date.now();
            
                var dat_obj=new Date(x);
                var d1=new Date();
                var h=d1.getHours();
                var m=d1.getMinutes();
                var s=d1.getSeconds();
               
                const now=new Date();
                const tmp=new tmp_lib({
                    user_id : id1,
                    //in_time : dat_obj.getTime(),
                    in_time:new String(h+":"+m+":"+s),
                    out_time:null,
                    //date:new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate())
                    date: date.format(now, 'DD-MM-YYYY')
                
                });
               
                tmp.save(function(err,result){
                    if(err)
                    {
                        res.json(err);
                    }
                    else{
                        //res.json(result);
                        res.redirect('/lib_tmp');
                    }
                });
            }
            else{


                tmp_lib.find({user_id:id1},function(err,docs1){
                   
                    if(err)
                    {
                        res.json(err);
                    }// wait ek min
                    else
                    {
                        //res.json(docs);
                       
            
                        const now = new Date();
                        let curtime=date.format(now,'HH:mm:ss')
                        let currDate = date.format(now, 'DD-MM-YYYY');
                       
                        docs1[0].out_time=curtime;
                        docs1[0].date=currDate;
                        //date:new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate()+1)
                        
                        docs1[0].save(function(err1,res1){
                            if(err1)
                            {
                                res.json(err1);
                            }
                            else
                            {
                                //res.json(res1);
                                    const lib1=new lib({
                                    user_id : docs1[0].user_id,
                                    in_time :docs1[0].in_time,
                                    out_time:docs1[0].out_time,
                                    date:docs1[0].date
                                    
                                    
                                });
                               
                                lib1.save(function(err,result){
                                    if(err)
                                    {
                                        res.json(err);
                                    }
                                    else{
                                        //res.json(result);



                                        tmp_lib.deleteOne({user_id:id1},function(err,result){
                                            if(err)
                                            {
                                                res.json(err);
                                            }
                                            else
                                            {
                                                //res.json(result);
                                                res.redirect('/lib_tmp');
                                            }
                                        })







                                    }
                                });
                                



                            }
                        });
            
                    }
                });



            }
        }
    });
}
else{
    tmp_lib.find(function(err,rows){
        if(err)
        {
            res.json(err);
        }
        else{
          
            let avl_seats=200-rows.length;
           
            //res.json(x);
            res.render('library_views/add_lib_tmp',{
                avl_seats:avl_seats,
                students:rows,
                errors:null
            })
        }
    })
}
});

router.post('/',function(req,res,next){
    var x=Date.now();
    //x=Date.now();
  
    var dat_obj=new Date(x);
    var d1=new Date();
    var h=d1.getHours();
    var m=d1.getMinutes();
    var s=d1.getSeconds();
   
    const tmp=new tmp_lib({
        user_id : req.body.user_id,
        //in_time : dat_obj.getTime(),
        in_time:new String(h+":"+m+":"+s),
        out_time:null,
        date:new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate())
    });
   
    tmp.save(function(err,result){
        if(err)
        {
            res.json(err);
        }
        else{
            //res.json(result);
            res.redirect('/lib_tmp');
        }
    });
})
router.put('/:id',function(req,res,next){
    tmp_lib.findById(req.params.id,function(err,docs){
     
        if(err)
        {
            res.json(err);
        }// wait ek min
        else
        {
            //res.json(docs);
        


            docs.out_time=Date.now(),
            //date:new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate()+1)
            
            docs.save(function(err1,res1){
                if(err1)
                {
                    res.json(err1);
                }
                else
                {
                    res.json(res1);
                }
            });

        }
    });
});


router.delete('/:id',function(req,res,next){
    tmp_lib.deleteOne({_id:req.params.id},function(err,result){
        if(err)
        {
            res.json(err);
        }
        else
        {
            res.json(result);
        }
    })
});

module.exports=router
