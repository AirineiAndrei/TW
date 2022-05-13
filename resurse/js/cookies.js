window.addEventListener("DOMContentLoaded",function(){
    checkBanner();
});

function setCookie(nume,val,timpExp,path="/"){
    //timpexp in ms
    d = new Date();
    d.setTime(d.getTime() + timpExp);
    document.cookie=`${nume}=${val}; expires = ${d.toUTCString()}; path = ${path}`;
    
}

function getCookie(nume){
    var v_cookie = document.cookie.split(";");
    for(let c of v_cookie){
        c = c.trim();
        if(c.startsWith(c+"="))
            return c.substring(nume.length + 1);
    }
}

function deleteCookie(nume){
    setCookie(nume,"",0);
}

function deleteAllCookies(){
    var v_cookie = document.cookie.split(";");
    for(let c of v_cookie){
        c = c.trim();
        c.split("=");
        deleteCookie(c);
    }
}   

function checkBanner(){
    if(getCookie("acceptat_banner"))
    {
        document.getElementById("banner_cookie").style.display="none";
    }
    else{
        document.getElementById("banner_cookie").style.display="none";
        document.getElementById("ok_cookie").onclick = function(){
            setCookie("acceptat_banner","true",5000);
            document.getElementById("banner_cookie").style.display="none";
        }
    }
}