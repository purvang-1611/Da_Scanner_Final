var nodemailer=require('nodemailer');
var inventory=require('./sportsinventory_model');
var demo={


    /*this function sends mail when student has borrowed equipment from sac*/
    sendMail:function(demo,callback){
        var x=Date.now();
        var dat_obj=new Date(x);

        inventory.findById(demo.equipment_id,function(err,rows){
            var transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user: process.env.mailID,
                    pass: process.env.mailPassword
                }
            });
            let email_id=demo.student_id+"@daiict.ac.in";
            var mailOptions={
                from: process.env.mailID,
                to:email_id,
                subject:"Equipment borrowed",
                text:"You have borrowed  "+ demo.quantity + " "+rows.name+ "\n\n Make sure you return this before -  "+new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate()+7).toDateString()+ " otherwise loan will be charged: - Rs.5 per day per equipment"
            };
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error)
                }
                else{
                    console.log('email sent'+info.response);
                }
            });
        })
        
        
    }
}
module.exports=demo;