
window.addEventListener("load",function(){
    
})



//cod cos virtual
function cost_virtual(){
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
                localStorage.setItem("cos_virtual",iduriProduse.join(","));  
            }
        });
    }
}



