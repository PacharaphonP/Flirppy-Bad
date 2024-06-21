const canvas = $("#canvas")[0];
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const fps = 60;
const pipeGapY = 100;
const pipeWidth = 50;
const pipeSpeed = 1;
const pipeGapX = 160;

const myImage = new Image();
myImage.src = "./images/bird.jpg";

let score = 0;
let pipes = [];
let interval;
let gameState = 0;
let isFlying = false;
let frame = fps;
const gravity = 1;
let player = {
    x: width * 3 /4,
    y: height/2 - 15,
    w: 30,
    speed: 0,
}

class Pipe {
    constructor(x, y, gap, w, s) {
        this.x = x;
        this.y = y;
        this.gap = gap;
        this.w = w;
        this.speed = s;

    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, 0, this.w, this.y);
        ctx.rect(this.x, this.y + this.gap, this.w, height - this.y);
        ctx.fillStyle = "rgba(50 ,50 , 50 ,1)";
        ctx.fill();
    }

    move() {
        if(this.x > width) {
            this.x = -pipeGapX;
            this.y = randomY();
        }
        else this.x = this.x + pipeSpeed;
    }

    
}

function generatePipes() {
    pipes = [];
    for(let i = 0; i < 4; i++) {
        pipes.push(new Pipe(pipeGapX*i - width - pipeWidth , randomY(), pipeGapY, pipeWidth, pipeSpeed));
    }
}


function update() {
    draw();
    frame--;
    if(frame == 0) frame = 60;
    pipesUpdate();
    playerUpdate();
    checkGameover(player);
    
}

function pipesUpdate() {
    pipes.forEach((pipe) => pipe.move());
}

function playerUpdate() {
    if (frame%10 == 0) player.speed += gravity;
    player.y += player.speed;
    if(player.y > height-player.w) player.y = height-player.w;
}

function checkGameover(p) {
    if(player.y > height +10 || player.y < -player.w )  {
        gameOver();
        return;
    }

    for(let i=0; i<pipes.length; i++) {
        let pipe = pipes[i];
        if(pipe.x < p.x && pipe.x + pipe.w > p.x || 
            pipe.x < p.x + p.w && pipe.x + pipe.w > p.x + p.w) {
                if(p.y >= pipe.y - 2 && p.y <= pipe.y + pipe.gap - p.w + 2) {
                    score++;
                }
                else{
                    console.log("working");
                    gameOver();
                    return;
                }
            }
    }

}

function draw() {
    ctx.clearRect(0, 0, width, height);
    pipes.forEach((pipe) => pipe.draw());
    drawPlayer();
}

function drawPlayer() {
    ctx.drawImage(myImage, player.x, player.y, player.w, player.w);
}

function randomY() {
    return Math.floor(Math.random() * height / 2 + height / 4 - pipeGapY / 2);
}

$("body").on("keydown", function(event) {
    if(event.keyCode == 32) {
        if(gameState === 0) {
            interval = setInterval(update, 1000/fps);
            generatePipes();
            gameState = 1;
        } else {
            player.speed = -3;
        }
    }


});

function drawStart() {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.rect(width/2, height/2 - 25, 190, 40);
    ctx.fill();
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("---spacebar to start---", width/2, height/2);
}

function gameOver() {
    clearInterval(interval);
    pipes = [];
    drawStart();
    gameState = 0;
    player.y = height/2 - 15;
    player.speed = 0;
    score = 0;
}
gameOver();
