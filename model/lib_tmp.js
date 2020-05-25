const db=require('mongoose');


//set the library Schema 
const library_tmp_Schema=db.Schema({
    user_id : {type:String},
    in_time : {type:String},
    out_time : {type:String},
    date:{type:String}
        
       
});
module.exports=db.model('tmp_records',library_tmp_Schema);