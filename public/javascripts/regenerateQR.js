document.getElementById('submitbutton').disabled=true;

function username(){
   
    console.log(document.getElementById('uname').value);
    if(document.getElementById('uname').value==undefined || document.getElementById('uname').value==null || document.getElementById('uname').value=="")
    {
        document.getElementById('error-ID').innerHTML="*Please enter DAIICT id";
        document.getElementById('uname').focus();
        document.getElementById('submitbutton').disabled=true;
    }
    else{
    let s1=Number(document.getElementById('uname').value);
    //console.log("vidhu"+s1);
    if(isNaN(s1)||s1<100000000 || s1>999999999)
    {
        document.getElementById('error-ID').innerHTML="*ID must be 9 digit number";
        document.getElementById('uname').focus();
        document.getElementById('submitbutton').disabled=true;
    }
   else
   {
     let batch_year=Math.trunc(s1/100000);
     let batch_id=Math.trunc(s1/1000)%100;
     let stu_id=Math.trunc(s1%1000);
     
    
    var x=Date.now();
    var dat_obj=new Date(x);
    var year=dat_obj.getFullYear();
    
   if(batch_id==01)
   {
     if(batch_year<=year && batch_year>=year-4)
     {
      //window.location.href="/lib_tmp/"+content;
      document.getElementById('submitbutton').disabled=false;
      document.getElementById('error-ID').innerHTML="";
      flag=0;
     }
     else{
      
        document.getElementById('error-ID').innerHTML="*ID is Invalid";
        document.getElementById('uname').focus();
        document.getElementById('submitbutton').disabled=true;
     }
   }
   else if(batch_id==11 || batch_id==12)
   {
      if(batch_year<=year && batch_year>=year-2)
      {
        //window.location.href="/lib_tmp/"+content;
        document.getElementById('submitbutton').disabled=false;
        document.getElementById('error-ID').innerHTML="";
        flag=0;
      }
      else
      {
       
        document.getElementById('error-ID').innerHTML="*ID is Invalid";
        document.getElementById('uname').focus();
        document.getElementById('submitbutton').disabled=true;
      }
   }
   else{
  
    document.getElementById('error-ID').innerHTML="*ID is Invalid";
    document.getElementById('uname').focus();
    document.getElementById('submitbutton').disabled=true;
   } 

   }
}
}

    

function ValidateEmail()
{
    var mail = document.getElementById('email').value;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(mail.value.match(mailformat))
    {
        document.form1.text1.focus();
        return true;
    }
    else
    {
        document.getElementById('error-email').innerHTML="*Email is Invalid";
        document.form1.text1.focus();
        return false;
    }
}