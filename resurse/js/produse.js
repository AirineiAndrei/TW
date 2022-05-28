
window.addEventListener("load",function(){

    var pret = document.getElementById("inp-pret");
    var dimensiune = document.getElementById("inp-dim");

    var pretValue = this.document.getElementById("infoRangePret");
    var dimValue = this.document.getElementById("infoRangeDim");

    var butoaneRadio=document.getElementsByName("gr_rad");

    

    pret.onchange = function(){
        pretValue.innerHTML = '(' + pret.value + ')';
    }
    dimensiune.onchange = function(){
        dimValue.innerHTML = '(' + dimensiune.value + ')';
    }
    var selectCateg = document.getElementById("inp-categorie")
    this.document.getElementById("filtrare").onclick = function(){  
        var valNume=document.getElementById("inp-nume").value.toLowerCase();
        var articole=document.getElementsByClassName("produs");
        var culoareAleasa = document.getElementById("inp-culori").value;

        let partimici;
        for(let buton of butoaneRadio){
            if(buton.checked)
                partimici = buton.value;
        }

        
        var categSelectate = []
        for(let categ of selectCateg)
            if(categ.selected)
                categSelectate.push(categ.value)

        for(let art of articole){
            art.style.display="none";

            let numeArt= art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let cond1= numeArt.includes(valNume);

            let pretArt=parseInt(art.getElementsByClassName("val-pret")[0].innerHTML)
            let cond2=(pret.value<=pretArt)

            let dimArt=parseInt(art.getElementsByClassName("val-dimensiune")[0].innerHTML)
            let cond3=(dimensiune.value<=dimArt)

            let partiMiciArt = art.getElementsByClassName("val-partimici")[0].innerHTML;
            let cond4 = true
            if(partiMiciArt === "Da" && partimici === "false")
                cond4 = false;
            if(partiMiciArt === "Nu" && partimici === "true")
                cond4 = false;

            let culoareArt = art.getElementsByClassName("val-culoare")[0].innerHTML;
            let cond5 = (!culoareAleasa || culoareArt === culoareAleasa || culoareAleasa === "orice")

            let categorieArt = art.getElementsByClassName("val-categorie")[0].innerHTML;
            let cond6 = (categSelectate.includes("orice") || categSelectate.includes(categorieArt))

            let conditieFinala = cond1 && cond2 && cond3 && cond4 && cond5 && cond6;
            if(conditieFinala)
                art.style.display = "block";
        }
    }
    document.getElementById("resetare").onclick=function(){
        var articole= document.getElementsByClassName("produs");
        for(let art of articole)
            art.style.display="block";
        document.getElementById("inp-nume").value = "";
        document.getElementById("inp-pret").value = 0;
        document.getElementById("inp-dim").value = 0;
        document.getElementById("inp-culori").value = ""
        for(let categ of selectCateg){
            if(categ.value === "orice")
               categ.selected = true;
            else
                categ.selected = false;
        }
        for(let buton of butoaneRadio){
            if(buton.value === "toate")
                buton.checked = true;
            else
                buton.checked = false;
        }
    }
    
    
    function sorteaza(semn){
        var articole= document.getElementsByClassName("produs");
        var v_articole=Array.from(articole);
        v_articole.sort(function(a,b){
            var pret_a= parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b= parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a!=pret_b)
                return semn*(pret_a - pret_b);
            else{
                
                var nume_a= a.getElementsByClassName("val-nume")[0].innerHTML;
                var nume_b= b.getElementsByClassName("val-nume")[0].innerHTML;
                return semn*nume_a.localeCompare(nume_b);
            }

        });

        for(let art of v_articole){
            art.parentElement.appendChild(art);
        }
    }

    document.getElementById("sortCrescNume").onclick=function(){
        sorteaza(1);
    }

    
    document.getElementById("sortDescrescNume").onclick=function(){
        sorteaza(-1);
    }

    window.onkeydown=function(e){
        console.log(e);
        if(e.key=="c" && e.altKey){
            var p_vechi=document.getElementById("suma")
            if(!p_vechi){
                suma=0;
                var articole= document.getElementsByClassName("produs");   
                for(let art of articole){
                    if (art.style.display != "none")
                        suma+=parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML);
                }
                var pgf=document.createElement("p");
                pgf.innerHTML="<b>Suma:</b> "+suma;
                pgf.id="suma";
                var sectiune=document.getElementById("produse");
                sectiune.parentNode.insertBefore(pgf, sectiune);
                setTimeout(function(){
                    var p_vechi=document.getElementById("suma");
                    if(p_vechi)
                        p_vechi.remove();
                } , 2000)
            }
        }
    }








    
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



