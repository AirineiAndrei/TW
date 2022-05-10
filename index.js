const express = require("express");
const { type } = require("express/lib/response");
const fs = require('fs');
const sharp = require('sharp');
const {Client}=require("pg")
const ejs = require('ejs')
const sass = require('sass')

// var client = new Client({user:"andrei",password:"andrei",database:"proiect",host:"localhost",port: 5432});
var client = new Client({
    user:"foqwmwrurfrpwd",
    password:"33720b6c3c5954639ca15c7f642597147af1fb8e62ba63a45bf0427890aece96",
    database:"daurmuvnvjekb6",
    host:"ec2-54-172-175-251.compute-1.amazonaws.com",
    port: 5432,
    ssl: {
    rejectUnauthorized: false
  }
});
 client.connect();

app = express();

app.use("/resurse",express.static(__dirname+"/resurse"));

app.set("view engine","ejs");

app.get(["/","/index","/home"],function(req,res){

    // client.query("select * from test",function(err,rezQuery){
        // console.log(rezQuery);
        // if(!err)
            res.render("pagini/index",{ip : req.ip , imagini : obImagini.imagini});
    // })
    // console.log(obImagini.imagini);
})

app.get("/produse",function(req,res){
    client.query("select * from jucarii",function(err,rezQuery){
        if(!err)
            res.render("pagini/produse",{produse : rezQuery.rows});
        else
            console.log("Eroare query\n",err);
    })
})

app.get("/produs/:id",function(req,res){
    console.log(req.params);
    client.query(`select * from jucarii where id=${req.params.id}`,function(err,rezQuery){
        // console.log(rezQuery);
        if(!err)
            res.render("pagini/produs",{prod : rezQuery.rows[0]});
        else
            console.log("Eroare produs\n",err);
    })
})


app.get("/eroare",function(req,res)
{
    randeazaEroare(res,1,"Titlu Schimbat");
})

app.get("*/galerie-animata.css",function(req,res){
    var sirScss=fs.readFileSync(__dirname+"/resurse/scss/galerie-animata.scss").toString("utf8");

    //5 7 9 11
    //2*0 + 5,2*1+5,2*2+5,2*3+5
    var numarPoze = Math.floor(Math.random()*4)*2 + 5;
    
    rezScss = ejs.render(sirScss,{nrPoze : numarPoze, totalPoze : obImagini.imagini.length});
    var caleScss = __dirname+"/temp/galerie-animata.scss";
    fs.writeFileSync(caleScss,rezScss);

    try {
        var rezCompilare = sass.compile(caleScss,{sourceMap:true});
        var caleCss = __dirname+"/temp/galerie-animata.css";

        fs.writeFileSync(caleCss,rezCompilare.css);
        res.setHeader("Content-type","text/css");
        res.sendFile(caleCss);
    }
    catch(err){
        res.send("Eroare scss");
        console.log("problema scss",err);
    }
})

app.get("/*.ejs",function(req,res){
    // res.status(403).render("pagini/403");
    randeazaEroare(res,403);
})


app.get("/salut",function(req,res){
    res.write("Salut");
    res.end();
})

app.get("/*",function(req,res){
    res.render("pagini"+req.url,function(err,rezRender){
        if(err){
            if(err.message.includes("Failed to lookup view")){
                // res.status(404).render("pagini/404");
                randeazaEroare(res,404);
            }
            else{
                res.render("pagini/eroare_generala");
            }
        }
        else{
            res.send(rezRender);
        }
    });
})

function creeazaImagini(){
    
    var buf=fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf8");
    obImagini=JSON.parse(buf);//global

    var today = new Date();
    today = today.getMonth() + 1;
    let season;
    if(today == 12 || today < 3)
        season = "iarna";
    if(today >= 3 && today < 6)
        season = "primavara";
    if(today >= 6 && today < 9)
        season = "vara";
    if(today >= 9 && today < 12)
        season = "toamna";
    
    let obBune = [];
    
    for (let imag of obImagini.imagini)
        if(imag.anotimp == season){
        let nume_imag, extensie;

        [nume_imag, extensie ]=imag.fisier.split(".")
        let dim_mic=150  
        
        imag.mic=`${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp` 
        // console.log(imag.mic);
        imag.mare=`${obImagini.cale_galerie}/${imag.fisier}`;
        if (!fs.existsSync(imag.mic))
            sharp(__dirname+"/"+imag.mare).resize(dim_mic).toFile(__dirname+"/"+imag.mic);

        let dim_mediu=300

        imag.mediu=`${obImagini.cale_galerie}/mediu/${nume_imag}-${dim_mediu}.png` 
        // console.log(imag.mediu);
        imag.mare=`${obImagini.cale_galerie}/${imag.fisier}`;
        if (!fs.existsSync(imag.mediu))
            sharp(__dirname+"/"+imag.mare).resize(dim_mediu).toFile(__dirname+"/"+imag.mediu);

            obBune.push(imag);
        }
        obImagini.imagini = obBune;
        // console.log(typeof obImagini);

}
creeazaImagini();


function creeazaErori(){
    
    var buf=fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf8");
    obErori=JSON.parse(buf);//global
}

function randeazaEroare(res,identificator,titlu,text,imagine){
    var eroare = obErori.erori.find(function(elem){
        return elem.identificator == identificator;
    });
    titlu = titlu || (eroare && eroare.titlu) || "Titlu custom eroare";
    text = text || (eroare && eroare.text) || "Text custom eroare";
    imagine = imagine || (eroare && obErori.cale_baza+'/'+eroare.imagine) || "/resurse/imagini/erori/semn.png";
    if(eroare && eroare.status)
        res.status(eroare.identificator).render("pagini/eroare_generala",{titlu: titlu,text: text,imagine: imagine});
    else
        res.render("pagini/eroare_generala",{titlu: titlu,text: text,imagine: imagine});
}
creeazaErori();

var s_port=process.env.PORT || 8080;
app.listen(s_port);

// app.listen(8080);
console.log("A pornit!");