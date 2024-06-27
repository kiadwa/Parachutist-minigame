const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

//game stat
var lives: number = 3;
var score: number = 0;
var hasPlane: boolean = false;
var releasePara: boolean = false;
var hasPara: boolean = false;
//initial sea hitbox and coor
var xsea: number = 0;
var ysea: number = 800;
var xhbsea: number = canvas.width;
var yhbsea: number = 200;

//initial boat coor
var xboat: number = 50;
var yboat: number = 680;
var xhbBoat: number = 50;
var yhbBoat: number = 750;
var dxhbBoat: number = 200;
var dyhbBoat: number = 150;
var boatSpd: number = 60;

//initial plane coor
var xplane: number = 1800;
var yplane: number = 20;
var planeSpd: number = 2;

//initial parachutist coor
var xpara: number = xplane;
var ypara: number = yplane + 70;
var paraSpd: number = 3;
var drownPoint: number = 800;


//load images from resources
const backgroundImg = new Image();
const seaImg = new Image();
const parachutistImg = new Image();
const planeImg = new Image();
const boatImg = new Image();

backgroundImg.src = require('./resources/background.png').default;
seaImg.src = require('./resources/sea.png').default;
boatImg.src = require('./resources/boat.png').default;
planeImg.src = require('./resources/plane.png').default;
parachutistImg.src = require('./resources/parachutist.png').default;



//adjust canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function draw(): void{
  //draw all background components
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  ctx?.drawImage(backgroundImg, 0 ,0 , canvas.width, canvas.height);
  ctx?.drawImage(seaImg, 0, 800, canvas.width, 200);
  //draw boat
  ctx?.drawImage(boatImg, xboat, yboat, 200, 150);
  //display sprite plane
  if(hasPlane){
    ctx?.drawImage(planeImg, xplane, yplane, 200, 150);
  }
  //draw sprite parachutist
  if(hasPara){
    ctx?.drawImage(parachutistImg,xpara, ypara, 100, 100);
  }
  
  // Display score
  ctx?.fillText("Score: " + score, 20, 30, 100);

  // Display lives
  ctx?.fillText("Lives: " + lives, 20, 60);

}

function movePlane(): void{
  // move the plane horizontally, 
  //when it reaches end of screen signal the game to despawn and respawn the plane
  if (hasPlane){
    if (xplane === 0){
      hasPlane = false;
    }else{
      xplane -= planeSpd
    }
  }else{
    hasPlane = true;
    xplane = 1800;
  }
}
function checkCollisionWithBoat(): boolean {
  return (
    xpara + 50 > xboat && // right edge of parachutist > left edge of boat
    xpara < xboat + dxhbBoat && // left edge of parachutist < right edge of boat
    ypara + 100 > yboat && // bottom edge of parachutist > top edge of boat
    ypara < yboat + dyhbBoat // top edge of parachutist < bottom edge of boat
  );
}
function checkCollisionWithSea(): boolean {
  return ypara + 100 > ysea; // bottom edge of parachutist > top edge of sea
}

function chanceToDropPara(): boolean{
  //randomize dropping of parachutist, because this 
  //will run every tick so the chance has to be low for randomness to be 
  //observable
  return Math.random() < 0.0099;
}
function moveParachutist():void {
  // Drop parachutist if there is none available parachutist on the screen
  if (hasPara) {
    if (checkCollisionWithBoat()) {
      hasPara = false;
      score += 10; 
    } else if (checkCollisionWithSea()) {
      hasPara = false;
      lives -= 1; 
    } else if (ypara < drownPoint) {
      ypara += paraSpd;
    } else {
      hasPara = false;
    }
  } else {
    hasPara = chanceToDropPara();
    ypara = yplane;
    xpara = xplane;
  }
}


function loop(): void{
  //game loop
  draw();
  movePlane();
  moveParachutist();
  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
      xboat -= boatSpd;
  } else if (event.key === 'ArrowRight') {
      xboat += boatSpd;
  }

  // ensure the boat stays within the canvas boundaries
  if (xboat < 0) {
      xboat = 0;
  } else if (xboat + 100 > canvas.width) {
      xboat = canvas.width - 100;
  }
});


window.onload = () => {
  loop();
}
