function validateForm(ev){
	var quant = document.getElementById('qty1').value;
if(quant<0 || quant==='0'){ //=== was matching value string with 0 numeric so was false
document.getElementById('error-qty').innerHTML="*Please enter a valid number";
document.getElementById('qty1').focus();
}
else{
    document.getElementById('error-qty').innerHTML=" ";
}
}

function validateForm1(ev){
	var quant = document.getElementById('qty2').value;
if(quant<0 || quant==='0'){ //=== was matching value string with 0 numeric so was false
document.getElementById('error-qty1').innerHTML="*Please enter a valid number";
document.getElementById('qty2').focus();
ev.preventDefault();
}
else{
    document.getElementById('error-qty1').innerHTML=" ";
}
}


function username(ev){
    var name = document.getElementById('sid').value;
    if(name.length==9){
        var year=name.substr(0,4)
        var cid=name.substr(4,2);
        var flag=0;
        if(cid=='01'||cid=='11'||cid=='12'||cid=='21' ||cid=='14'){
            flag=1;
        } 
        if(year<2001||year>=2001&&flag==0){
        
            document.getElementById('error-ID').innerHTML="*ID is Invalid";
            document.getElementById('sid').focus();
             
        }     
        else{
            document.getElementById('error-ID').innerHTML="";
        }
        
    }
    else{
        document.getElementById('error-ID').innerHTML="*ID have must be 9 digit";
        document.getElementById('sid').focus();
    }      
}

function isNumberKey(evt)
      {
         var charCode = (evt.which) ? evt.which : event.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

         return true;
      }

