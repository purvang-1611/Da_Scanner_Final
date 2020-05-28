function username(){
    var name = document.getElementById('uname').value;
    //alert(name);
    if(name.length!=9){
        document.getElementById('error-ID').innerHTML="*ID have must be 9 digit";
        document.getElementById('uname').focus();
    }
    else{
            document.getElementById('error-ID').innerHTML="";
    }          
}
function password(){
    var psw=document.getElementById('psw').value;
        if(psw.length<4){
            document.getElementById('error-password').innerHTML = "* Password must be greater than 4 ";
            document.getElementById('psw').focus();
        }
        if(psw.length>=4){
            document.getElementById('error-password').innerHTML = "";
        }
        if(psw.length<4 ){
           return false;
        } 
}