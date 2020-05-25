function changeFunc() {
    var selectedValue = document.getElementById("selectBox").value;
    var d1=document.getElementById("ReportDate");
   
    var i=document.getElementById("stuID");
    if(selectedValue=="1"){
        
        d1.style.display="block";
       
        i.style.display="none";
    }
    else if(selectedValue=="2"){
        i.style.display="block";
        d1.style.display="none";
      
    }
    else{
        i.style.display="block";
        d1.style.display="block";
       
    }
   }
   function DateCheck()
{
  var StartDate= document.getElementById('sdate').value;
  var EndDate= document.getElementById('edate').value;
  var eDate = new Date(EndDate);
  var sDate = new Date(StartDate);
  if(StartDate!= '' && StartDate!= '' && sDate> eDate)
    {
    alert("Please ensure that the End Date is greater than or equal to the Start Date.");
    document.getElementById('edate').focus();
    return false;
    }
}