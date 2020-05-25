
window.addEventListener('load',(event)=>{
  
    document.getElementById('addnewrecord').hidden=true;
    document.getElementById('UpdateNewStock').hidden=true;
    document.getElementById('rqty1').addEventListener("change",f1);
    document.getElementById('rdft1').addEventListener("change",f1);
    document.getElementById('rrpr1').addEventListener("change",f1);
    document.getElementById('dft2').hidden=true;
    document.getElementById('rpr2').hidden=true;
    document.getElementById('defects1').required=false;
    document.getElementById('repair1').required=false;
  });
  function submitFn(){
    if(document.getElementById('rqty1').checked){
        let box = document.getElementById('qty1');
        if(box.value.length >=1){
          return true;
        }
        else{
          return false;
        }
    }
    else if(document.getElementById('rrpr1').checked){
      let box = document.getElementById('repair1');
      if(box.value.length >=1){
        return true;
      }
      else{
        return false;
      }
  }
  else if(document.getElementById('rdft1').checked){
    let box = document.getElementById('defects1');
    if(box.value.length >=1){
      return true;
    }
    else{
      return false;
    }
}
  }
  function f1()
  {
      console.log("in");
      if(document.getElementById('rqty1').checked)
      {
        console.log("in if1");
          document.getElementById('dft2').hidden=true;
          document.getElementById('qty2').hidden=false;
          document.getElementById('rpr2').hidden=true;
          document.getElementById('qty1').required=true;
          
      }
      else if(document.getElementById('rrpr1').checked)
      {
        console.log("in if2");
        document.getElementById('dft2').hidden=true;
        document.getElementById('rpr2').hidden=false;
        document.getElementById('qty2').hidden=true;
        document.getElementById('repair1').required=true;
        document.getElementById('qty1').required=false;
        document.getElementById('defects1').required=false;
      }
      else if(document.getElementById('rdft1').checked)
      {
        console.log("in if3");
          document.getElementById('qty2').hidden=true;
          document.getElementById('dft2').hidden=false;
          document.getElementById('rpr2').hidden=true;
          document.getElementById('defects1').required=true;
          document.getElementById('qty1').required=false;
          document.getElementById('repair1').required=false;

          
      }
  }

  function AddNewRecord(){
    
    document.getElementById('addnewrecord').hidden=false;
    document.getElementById('UpdateNewStock').hidden=true;
  }
  function UpdateNewStock(){
    
    document.getElementById('addnewrecord').hidden=true;
    document.getElementById('UpdateNewStock').hidden=false;
  }



function isNumberKey(evt)
      {
         var charCode = (evt.which) ? evt.which : event.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

         return true;
      }

