function isNumberKey(evt)
      {
         var charCode = (evt.which) ? evt.which : event.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

         return true;
      }
      function isCharKey(evt)
      {
         var charCode = (evt.which) ? evt.which : event.keyCode
         if (charCode > 64 && charCode < 123 )
            return true;
         else
            return false;
      }
      function validate(e){
          //alert("hey");
        var password1 = document.getElementById('Pass1').value; 
        var password2 = document.getElementById('Pass2').value; 
        if(password1!=password2 || password1.length < 6 || password2.length <6){
            document.getElementById('error-Password').innerHTML="*Passwords must match and must be atleast 6 characters";
            document.getElementById('submitButton').disabled=true;
            //document.getElementById('Pass2').focus();
        }else{
            document.getElementById('error-Password').innerHTML="";
            document.getElementById('submitButton').disabled=false;
        }
      }
      function IDCheck(){
            var name = document.getElementById('stuID').value;
            if(name.length<9 || name.length > 9){
                document.getElementById('error-ID').innerHTML="*ID have must be 9 digit";
                document.getElementById('stuId').focus();
            }
            else{
                document.getElementById('error-ID').innerHTML="";
                document.getElementById('emailId').value=name+"@daiict.ac.in";
                var year=name.substr(0,4)
                var cid=name.substr(4,2);
                var flag=0;
                /*if(cid=='01'||cid=='11'||cid=='12'||cid=='14'||cid=='21'){
                    flag=1;
                } */
                if(year<2001){
                
                    document.getElementById('error-ID').innerHTML="*ID is Invalid";
                    document.getElementById('stuId').focus();
                }     
                else{
                    document.getElementById('error-ID').innerHTML="";
                    document.getElementById('emailId').value=name+"@daiict.ac.in";
                }
            }
        }
        function EmailCheck(){
            var name = document.getElementById('emailId').value;
            
            if(name.length<22){
                document.getElementById('error-Email').innerHTML="*Email ID is Invalid";
                //document.getElementById('emailId').focus();
            }
            else{
                var year=name.substr(0,4)
                var cid=name.substr(4,2);
                var sid=name.substr(6,3);
                var em=name.substr(9);
                var flag=0;
                /*if(cid=='01'||cid=='11'||cid=='12'||cid=='14'||cid=='21'){
                    flag=1;
                } */
                if(year<2001||sid<='000'||em!="@daiict.ac.in"){
                
                    document.getElementById('error-Email').innerHTML="*Email ID is Invalid";
                    //document.getElementById('emailId').focus();
                }     
                else{
                    document.getElementById('error-Email').innerHTML="";
                }
            }
        }
        function BatchCheck(){
            var name = document.getElementById('Batch').value;
            if(name.length<4){
                document.getElementById('error-Batch').innerHTML="*Batch have must be 4 digit";
                document.getElementById('Batch').focus();
            }
            else{
                
                if(name<2001){
                
                    document.getElementById('error-Batch').innerHTML="*ID is Invalid";
                    document.getElementById('Batch').focus();
                }     
                else{
                    document.getElementById('error-Batch').innerHTML="";
                }
            }
        }