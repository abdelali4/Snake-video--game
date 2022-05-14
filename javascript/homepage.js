template=23;
score=0;
keydown=0;

document.querySelector("#keybord").addEventListener("click",(e)=>{
    if(e.target.className=="button_keybord"){
        testing_avalibilty_keydown(e.target.getAttribute("id"));
    }
    else if(e.target.className.includes("icon")){
        testing_avalibilty_keydown(e.target.parentElement.getAttribute("id"));

    }
});
window.addEventListener('keyup',(e)=>{
    testing_avalibilty_keydown(e.key);
}
);
function testing_avalibilty_keydown(key){
    if(key=="ArrowUp" || key=="ArrowDown" || key=="ArrowLeft" || key=="ArrowRight"){
        if(keydown=="ArrowLeft" || keydown=="ArrowRight"){
            if(key!="ArrowLeft" && key!="ArrowRight"){
                keydown=key;
            }
        }
        else if(keydown=="ArrowUp" || keydown=="ArrowDown"){
            if(key!="ArrowUp" && key!="ArrowDown"){
                keydown=key;
            }
        }
    }
}
function movement_head(){
    var snake_head=document.querySelector(".snake");
    switch(keydown){
        // leftbutton
        case "ArrowLeft":{
            x--;
            if(x==0){
                x=template;
            }
            accident_happend=accident();
            if(!accident_happend){
                snake_head.style.gridColumn=`${x}/${x+1}`;
                movement_tail();
                var eated=eat_food();
                update_coordonates(eated);
            }
            break;
        }
        // rightbutton
        case "ArrowRight":{
            x++;
            if(x==template+1){
                x=1;
            }
            accident_happend=accident();
            if(!accident_happend){
                snake_head.style.gridColumn=`${x}/${x+1}`;
                movement_tail();
                var eated=eat_food();  
                update_coordonates(eated);
            }
            break;
        }
        // button down
        case "ArrowDown":{
            y++;
            if(y==template+1){
                y=1;
            }
            accident_happend=accident();
            if(!accident_happend){
                snake_head.style.gridRow=`${y}/${y+1}`;      
                movement_tail();
                var eated=eat_food();
                update_coordonates(eated);
            }
            break;
        }
        // button up
        case "ArrowUp":{
            y--;
            if(y==0){
                y=template;
            }
            accident_happend=accident();
            if(!accident_happend){
                snake_head.style.gridRow=`${y}/${y+1}`;
                movement_tail();
                var eated=eat_food();
                update_coordonates(eated);
            }
            break;
        }
        default:{
            break;
        }
        
    }
    
}
function movement_tail(){
    var snake=document.querySelectorAll(".snake");
    for(var i=1;i<x_coordonates.length;i++){
        snake[i].style.gridColumn=x_coordonates[i-1];
        snake[i].style.gridRow=y_coordonates[i-1];
    }  
}
function update_coordonates(eated){
    for(var j=(x_coordonates.length)-1;j>=1;j--){
        x_coordonates[j]=x_coordonates[j-1];
        y_coordonates[j]=y_coordonates[j-1];
    } 
    x_coordonates[0]=`${x}/${x+1}`;
    y_coordonates[0]=`${y}/${y+1}`;  
}
function create_food(){
    for(i=food.length;i<2;i++){
        var food_size=Math.round(Math.random())+1;
        var food_x=Math.round(Math.random()*(template-food_size-1))+1;
        var food_y=Math.round(Math.random()*(template-food_size-1))+1;
        food.push({x:food_x,y:food_y,size:food_size});
        var peace_of_food=document.createElement("div");
        peace_of_food.classList.add("food");
        peace_of_food.style.gridColumn=`${food_x}/${food_x+food_size}`;
        peace_of_food.style.gridRow=`${food_y}/${food_y+food_size}`;
        document.querySelector("#window").append(peace_of_food);
    }
}
function eat_food(){
    eating=0;
    var k=0;
    food.forEach(peace=>{
        if((peace.x<=x &&x<=peace.x+peace.size-1 && peace.y<=y &&y<=peace.y+peace.size-1)){ 
            var eat_audio=document.querySelector("#eat_audio");
            eat_audio.currentTime=0;
            eat_audio.volume=0.5;
            setTimeout(
                ()=>{
                    eat_audio.volume=0;
                },650
            );
            document.querySelectorAll(".food")[k].remove();
            food.splice(k,1);
            scale_snake();
            score+=peace.size;
            FPS-=peace.size/2;
            eating=1;
            console.log(k);
        }
        k++;
    });
    if(eating){
        create_food();
    }
    return eating;
}
function scale_snake(){
    var tail=document.createElement("div");
    tail.classList.add("snake");
    var len=x_coordonates.length;
    tail.style.gridColumn=x_coordonates[len-1];
    tail.style.gridRow=y_coordonates[len-1];
    document.querySelector("#window").append(tail);
    x_coordonates.push(x_coordonates[len-1]);
    y_coordonates.push(y_coordonates[len-1]);
}
function animation(){
    movement_head();
    time=setTimeout(()=>{
        animation();
    },FPS);
    if(accident_happend){
        game_over();   
        clearTimeout(time);
    }
}
function accident(){
    for(var k=1;k<x_coordonates.length-1;k++){
        if(`${x}/${x+1}`==x_coordonates[k] &&`${y}/${y+1}`==y_coordonates[k]){
            clearTimeout(time);return true;
        }  
    }
    return false;
}
function start_game(){
    x=Math.round(template/2);
    y=Math.round(template/2);
    FPS=125;
    food=[];
    keydown="ArrowUp";
    x_coordonates=["12/13"];
    y_coordonates=["12/13"];
    accident_happend=false;
    size=0;
    i=4;
    document.body.insertAdjacentHTML("beforeend",`
    <div id="start" onclick="play()"></div>`);
    start=document.querySelector("#start");
    animation_start();   
}
function animation_start(){
    t=setTimeout(
        ()=>{
            animation_start()
        }
        ,25
    );
    if(size==50){
        i--;
        if(i==0){
            clearTimeout(t);
            start.style.fontSize="35px";
            start.style.cursor="pointer";
            start.innerText="Play";
            return;
        }
        start.innerText=i;
        size=0;
        start.style.fontSize=size+"px";
    }
    size+=2;
    start.style.fontSize=size+"px";
}
function game_over(){
    document.body.insertAdjacentHTML("beforeend",`
    <div id="game_over">
        <div>Game over</div>
        <div id="score">Score: ${score}</div>
        <div id="try_again" class="hover_effect" onclick='try_again()'>Try again</div>
    </div>`);
}
function try_again(){
    document.querySelector("#game_over").remove();
    document.querySelector("#window").remove();
    start_game();
}
document.body.onload=function(){
    start_game();
}
function play(){
    if(i==0){
        start.remove();
        document.body.insertAdjacentHTML("beforeend",
        `<div id="window">
            <div class="snake head"></div>
        </div>`);
        create_food();
        animation();
        scale_snake();
        var eat_audio=document.querySelector("#eat_audio");
        eat_audio.volume=0;
        eat_audio.play();
    }
}