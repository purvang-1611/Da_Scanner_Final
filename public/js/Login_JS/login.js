function username(){
    var name = document.getElementById('uname').value;
    //alert(name);
    if(name.length<9){
        document.getElementById('error-ID').innerHTML="*ID have must be 9 digit";
        document.getElementById('uname').focus();
    }
    else{
        var year=name.substr(0,4)
        var cid=name.substr(4,2);
        var flag=0;
        if(cid=='01'||cid=='11'||cid=='12'||cid=='14'||cid=='21'|| cid=='00'){
            flag=1;
        } 
        if(year<2001||year>=2001&&flag==0){
        
            document.getElementById('error-ID').innerHTML="*ID is Invalid";
            document.getElementById('uname').focus();
        }     
        else{
            document.getElementById('error-ID').innerHTML="";
        }
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