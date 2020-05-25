const monoogse=require('mongoose');


//set up inventory schema 
const inventorySchema=monoogse.Schema({
    name:{type:String},
    NumberOfItems:{type:Number},
    NumberOfAvailable:{type:Number},
    NumberOfDefects:{type:Number},
    versionKey: false

});

module.exports=monoogse.model('inventory_records',inventorySchema);