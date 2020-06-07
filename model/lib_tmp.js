const db=require('mongoose');

var schema = db.Schema;
//set the library Schema 
let library_tmp_Schema=new schema({
    userId : {type:Number},
    in_time : {type:String},
    out_time : {type:String},
    date: {type:Date,default: ""}
        
       
});
module.exports=db.model('libTemp_records',library_tmp_Schema);