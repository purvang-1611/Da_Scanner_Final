const db=require('mongoose');
/*set up library schema  for Rc student in out*/
const librarySchema=db.Schema({
    user_id : {type:String},
    in_time : {type:String},
    out_time : {type:String},
    date:{type:String}
        
       
});
module.exports=db.model('lib_records',librarySchema);