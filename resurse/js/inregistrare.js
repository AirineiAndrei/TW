window.onload = function(){
    var formular=document.getElementById("form_inreg");
    if(formular){
    formular.onsubmit= function(){
            if(document.getElementById("parl_inreg").value != document.getElementById("rparl").value){
                // alert(document.getElementById("inp-prenume").value);
                // alert(document.getElementById("parl_inreg").value);
                alert("Nu ati introdus acelasi sir pentru campurile \"parola\" si \"reintroducere parola\".");
                return false;
            }

            return true;
        }
    }
 }