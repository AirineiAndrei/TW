
window.addEventListener("load",function(){
    
    iduriProduse = this.localStorage.getItem("cos_virtual");
    if(iduriProduse){
        iduriProduse = iduriProduse.split(",");
    }
    else{
        iduriProduse = [];
    }
    for(let id_p of iduriProduse){
        var ch = this.document.querySelector(`[value=${id_p}].select-cos`);
        if(ch){
            ch.checked = true;
        }
    }






    //cod cos virtual

    var checkboxuri = document.getElementByClassName("select-cos");
    for(let ch of checkboxuri)
    {
        ch.onchange(function(){
            if(this.checked){
                iduriProduse = localStorage.getItem("cos_virtual");
                if(iduriProduse){
                    iduriProduse.split(",");

                }
                else{
                    iduriProduse = [];
                }
                iduriProduse.push(this.value);
            }
            else{
                var poz = iduriProduse.indexOf(this.value);
                if(poz != -1)
                    iduriProduse.splice(poz,1);
            }
            localStorage.setItem("cos_virtual",iduriProduse.join(","));
        });
    }
})



