const express = require("express");
const { type } = require("express/lib/response");
const fs = require('fs');
const sharp = require('sharp');
const {Client}=require("pg");
const ejs = require('ejs');
const sass = require('sass');

const formidable = require('formidable');
const crypto = require('crypto');
const session = require('express-session');
const nodemailer = require('nodemailer')

const html_to_pdf = require('html-pdf-node');
const juice=require('juice');
const QRCode = require('qrcode');
const { resourceUsage } = require("process");





async function trimiteMail(email, subiect, mesajText, mesajHtml, atasamente=[]){
	var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{//date login 
			user:obGlobal.emailServer,
            pass:"vqtconlfgfkvccif"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	//genereaza html
	await transp.sendMail({
		from:obGlobal.emailServer,
		to:email,
		subject:subiect,//"Te-ai inregistrat cu succes",
		text:mesajText, //"Username-ul tau este "+username
		html: mesajHtml,// 
		attachments: atasamente
	})
	console.log("trimis mail");
}


const obGlobal = {
    obImagini:null,
    obErori:null,
    emailServer:"airinei.tehnici.web@gmail.com",
    port: 8080,
    sirAlphaNum:"",
    protocol: null,
    numeDomeniu: null
};

if(process.env.SITE_ONLINE){
    obGlobal.protocol = "https://";
    obGlobal.numeDomeniu = "https://limitless-reef-59862.herokuapp.com";
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
}
else{
    obGlobal.protocol = "http://"
    obGlobal.numeDomeniu = "localhost:8080";
    var client = new Client({user:"andrei",password:"andrei",database:"proiect",host:"localhost",port: 5432});
}






var v_interval = [[48,57],[65,90],[97,122]];
for(let interval of v_interval){
    for(let i = interval[0]; i <= interval[1];i++)
        obGlobal.sirAlphaNum += String.fromCharCode(i);
}

function genereazaToken(n){
    let token = "";
    for(let i = 0;i<n;i++){
        token += obGlobal.sirAlphaNum[Math.floor(Math.random() * obGlobal.sirAlphaNum.length)]
    }
    return token;
}

client.connect();

app = express();
app.use(["/produse_cos","/cumpara"],express.json({limit:'2mb'}));

app.use(session({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: false
}));

app.use("/resurse",express.static(__dirname+"/resurse"));

app.use("/*",function(req,res,next){
    res.locals.utilizator = req.session.utilizator;
    next();
});


app.set("view engine","ejs");

app.get(["/","/index","/home"],function(req,res){
    res.render("pagini/index",{ip : req.ip , imagini : obGlobal.obImagini.imagini});
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
    
    rezScss = ejs.render(sirScss,{nrPoze : numarPoze, totalPoze : obGlobal.obImagini.imagini.length});
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

//------------------------ cos virtual
app.post("/produse_cos",function(req,res){
    if(req.body.ids_prod.length != 0){
        let querySelect = `select * from jucarii where id in (${req.body.ids_prod.join(",")})`;
        client.query(querySelect,function(err,rezQuery){
            if(err){
                console.log(err);
                res.send("Eroare Baza de date");
            }
            res.send(rezQuery.rows);
        });
    }
    else{
        res.send([]);
    }
}); 



//--------------------------- utilizatori
app.get("/logout",function(req,res){
    req.session.destroy();
    res.locals.utilizator = undefined;
    res.render("pagini/logout");
});


parolaServer = "tehniciweb";
app.post("/inreg" , function(req,res){
    var formular = new formidable.IncomingForm();
    formular.parse(req,function(err,campuriText,campuriFisier){
        var parolaCriptata = crypto.scryptSync(campuriText.parola,parolaServer,64).toString('hex');
        var token = genereazaToken(100);
        var comandaInserare = `insert into utilizatori (username,nume,prenume,parola,email,culoare_chat,cod) 
                                values ('${campuriText.username}','${campuriText.nume}','${campuriText.prenume}','${parolaCriptata}','${campuriText.email}','${campuriText.culoare_chat}','${token}' )`;
        
        var eroare = "";
        if(campuriText.username == ""){
            eroare += "Username necompletat. ";
        }
        if(!campuriText.username.match(new RegExp("^[A-Za-z0-9]+$"))){
            eroare += "Username contine caractere nepermise. ";
        }
        if(!eroare)
        {
            var queryUtiliz = `select username from utilizatori where username = '${campuriText.username}'`;
            client.query(queryUtiliz,function(err,rezUtiliz){
                if(rezUtiliz && rezUtiliz.rows.length != 0){
                    eroare += "Usernameul mai exista";
                    res.render("pagini/inregistrare", {err : "Eroare" + eroare});
                }
                else{
                    client.query(comandaInserare,function(err,rezInserare){
                        if(err){
                            console.log(err);
                            res.render("pagini/inregistrare", {err : "Eroare baza de date"});
                        }
                        else{
                            res.render("pagini/inregistrare", {raspuns : "Datele au fost introduse"});
                            let linkConfirmare = obGlobal.protocol + obGlobal.numeDomeniu + "/cod/" + token;
                            trimiteMail(campuriText.email,"Te-ai inregistrat","text",`<h1>Salut!</h1>
                                                            <p style='color:blue'>Username-ul tau este ${campuriText.username}.</p>
                                                            <a href = '${linkConfirmare}'>Confirma Mail</a>`);
                        }
                    }); 
                }
            });
        }
        else                       
            res.render("pagini/inregistrare", {err : "Eroare: " + eroare});
    });
});


app.post("/login", function(req,res){
    var formular = new formidable.IncomingForm();
    formular.parse(req,function(err,campuriText,campuriFisier){
        var parolaCriptata = crypto.scryptSync(campuriText.parola,parolaServer,64).toString('hex');
        var querySelect = `select * from utilizatori where username = '${campuriText.username}' and parola = '${parolaCriptata}' and confirmat_mail = true`;
        client.query(querySelect,function(err,rezSelect){
            // console.log("\n\n\nIncerc Logare\n\n\n")
            if(err)
                console.log(err);
            else{
                if(rezSelect.rows.length == 1){
                    req.session.utilizator = {
                        nume: rezSelect.rows[0].nume,
                        prenume: rezSelect.rows[0].prenume,
                        username: rezSelect.rows[0].username,
                        email: rezSelect.rows[0].email,
                        rol: rezSelect.rows[0].rol,
                        culoare_chat: rezSelect.rows[0].culoare_chat    
                    }
                    res.redirect("/index")
                }
                else{
                    randeazaEroare(res,-1,"Login esuat","Mail neconfirmat sau parola gresita",null);
                }
            }
        });
    });
});

app.get("/*.ejs",function(req,res){
    // res.status(403).render("pagini/403");
    randeazaEroare(res,403);
})


app.get("/salut",function(req,res){
    res.write("Salut\n");
    res.write(req.session.utilizator.username);
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
    var obImagini=JSON.parse(buf);//global

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
        obGlobal.obImagini = obImagini;

}
creeazaImagini();


function creeazaErori(){
    
    var buf=fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf8");
    var obErori=JSON.parse(buf);//global
    obGlobal.obErori = obErori;
}

function randeazaEroare(res,identificator,titlu,text,imagine){
    var eroare = obGlobal.obErori.erori.find(function(elem){
        return elem.identificator == identificator;
    });
    titlu = titlu || (eroare && eroare.titlu) || "Titlu custom eroare";
    text = text || (eroare && eroare.text) || "Text custom eroare";
    imagine = imagine || (eroare && obGlobal.obErori.cale_baza+'/'+eroare.imagine) || "/resurse/imagini/erori/semn.png";
    if(eroare && eroare.status)
        res.status(eroare.identificator).render("pagini/eroare_generala",{titlu: titlu,text: text,imagine: imagine});
    else
        res.render("pagini/eroare_generala",{titlu: titlu,text: text,imagine: imagine});
}
creeazaErori();

var s_port=process.env.PORT || obGlobal.port;
app.listen(s_port);

console.log("A pornit!");