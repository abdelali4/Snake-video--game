document.querySelector("#play_now").addEventListener("click",(e)=>{
    try{
        xhr= new XMLHttpRequest();
    }
    catch(e){
        xhr=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.open("POST","script_php/lunch.php",true);
    xhr.send();
    xhr.onload=function(){
        window.location.href="homepage.php";
    }
});