
var sel = document.getElementById("equipName");
var opt;
function getSelectedOption(sel) {
    for ( var i = 0, len = sel.options.length; i < len; i++ ) {
        opt = sel.options[i];
        if ( opt.selected === true ) {
            break;
        }
    }
    return opt;
}

window.onload = function(){
    document.getElementById('check').onclick = checkFun;
}
function checkFun(){
   // var sportsEquipment = getSelectedOption(sel);
    
   var quantity = document.getElementById("qty").value;
    //for particular selected item check in the database that stock is there or not
    if(quantity == 1)
    {
        alert("available");
    }
    else
    {
       alert("not available");
    }

}