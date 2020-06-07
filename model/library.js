const db=require('mongoose');
/*set up library schema  for Rc student in out*/
let librarySchema=db.Schema({
    userId : {type:Number},
    in_time : {type:String},
    out_time : {type:String},
    date:{type:Date}
        
       
});
module.exports=db.model('lib_records',librarySchema);