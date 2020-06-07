
//const QRcode=require('qrcode');
const qrimg=require('qr-image');
const fs=require('fs');
const crypto = require('crypto');
var nodemailer=require('nodemailer');
const path = require("path");
var qr={
    
    emailEmployee(email_id,Password)
    {
        
        var transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user: process.env.mailID,
                pass: process.env.mailPassword //TODO HIDE
            }
        });
        var mailOptions={
            from: process.env.mailID,
            to:email_id,
            subject:"Registration successful",
            text:"Hello, \n\n You have successfully registered at DA-Scanner.\n\n Please find your password Below (Dont share with Anyone) \n Password : " + Password
            //html: "Embedded image: <img src='cid:unique@kreata.ee' />",
            
        };
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }
            else{
                console.log('email sent'+info.response);
            }
        });
    },

    generateQR(id,id1,callback)
    {
        
        let flag = false;
        let mykey = crypto.createCipher('aes-128-cbc', 'dascanner');
        let encryptedID = mykey.update(id1, 'utf8', 'hex')
        encryptedID += mykey.final('hex');
        let dir =path.resolve(__dirname,'..');
        console.log(dir);
        let qr_png=qrimg.imageSync(encryptedID,{ type: 'png'});
        let qr_code_file_name = id + '.png';
        fs.writeFileSync(dir+'/GeneratedQRCodes/' + qr_code_file_name, qr_png,function(err)
        {
            if(err)
            {
                console.log(err);
            }
        });

        let email_id=id+"@daiict.ac.in";
        let img_src=dir+'/GeneratedQRCodes/'+qr_code_file_name;

        
            var transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user: process.env.mailID,
                    pass: process.env.mailPassword //TODO HIDE
                }
            });
            var mailOptions={
                from: process.env.mailID,
                to:email_id,
                subject:"DA-Scanner QR code for "+id,
                text:"Hello, \n\n You have just registered or regenerated your QR code. Here is your QR code.\n\n You can regenerate 5 more QR codes by logging in to your profile. \n\n Contact Admin if 5 tries are done",
                //html: "Embedded image: <img src='cid:unique@kreata.ee' />",
                attachments: [{
                    filename: qr_code_file_name,
                    path: img_src,
                    
                }]
                
            };
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error)
                }
                else{
                    console.log('email sent'+info.response);
                    flag=true;
                    
                }
                callback(flag);
            });

            

    }
}


module.exports=qr;