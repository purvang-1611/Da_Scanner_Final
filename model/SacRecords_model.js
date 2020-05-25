const db=require('mongoose');
const sacSchema=db.Schema({


    //set the sac schema and equipment_id as a foriegn key
    equipment_id : {type:db.Schema.ObjectId,ref:"inventorytb"},
        student_id : {type:String},
        issue_date : {type:String},
        return_date : {type:String},
        quantity:{type:Number},
        loan : {type:Number}
       
});
module.exports=db.model('sac_records',sacSchema);