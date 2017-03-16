
//  console.log('ready!')

let container = document.getElementById('playfield');

let gameBoard = container.getContext('2d');
let width = container.width = 1216;
let height = container.height = 901;
console.log(width, height);

// this part is part of the tutorial, will alter for my own project later
// creating a random function now so i dont have to later many times
function random (min, max) {
  let num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
};

function Blocks (posx, posy) {
  this.xB = 0 + (posx * 80);
  this.yB = 48 + (posy * 24);
  this.color = 'rgb('+random(0,220)+','+random(0,220)+','+random(0,220)+')';
  this.border = 'black';
  this.velX = 0
  this.velY = 0
  this.sizex = 80;
  this.sizey = 24;
};

// Time to model the balls
function Ball () {
//  this.x = random(0, width);
//  this.y = random(0, height);
  this.x = 1150
  this.y = 450
//  this.velX = random(-10, 10);
//  this.velY = random(-10, 10);
  this.velX = 3;
  this.velY = -3;
  this.color = 'white';
  this.size = 10;
};


//Creating the ball, will alter later for single ball on startup
Ball.prototype.draw = function () {
  gameBoard.beginPath();
  gameBoard.fillStyle = this.color;
  gameBoard.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  gameBoard.fill();
}

Blocks.prototype.draw = function () {
  gameBoard.beginPath();
  gameBoard.lineWidth = '2';
  gameBoard.strokeStyle = 'black';
  gameBoard.fillStyle = this.color;
  gameBoard.rect(this.xB, this.yB, this.sizex, this.sizey);
  gameBoard.stroke();
  gameBoard.fill();
}

Blocks.prototype.update = function() {
//  let blocksDx = Math.abs(this.xB - this.sizex - balls[0].size);
//  let blocksDy = Math.abs(this.yB - this.sizey - balls[0].size);
//  for (let i = 0; i < blocks.length; i++) {} 


// expensive alternative:
//function intersects(circle, rect) {
//    circleDistance.x = Math.abs(circle.x - rect.x);
//    circleDistance.y = Math.abs(circle.y - rect.y);
//
//    if (circleDistance.x > (rect.width/2 + circle.r)) { return false; }
//    if (circleDistance.y > (rect.height/2 + circle.r)) { return false; }
//
//    if (circleDistance.x <= (rect.width/2)) { return true; } 
//    if (circleDistance.y <= (rect.height/2)) { return true; }
//
//    cornerDistanceSq = Math.sqr(circleDistance.x - rect.width/2) +
//                        Math.sqr(circleDistance.y - rect.height/2);
//
//    return (cornerDistanceSq <= (Math.sqr(circle.r)));
//}
}

//Must create the function to update teh position of the balls, and eventually Ball

Ball.prototype.update = function () {
  // bounce from the right side
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }
  //bounce from the left side
  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }
  //bounce from the top
  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }
  //bounce from bottom
  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }
  // adds the velocity to the position for each time it's called, which is constant
  this.x += this.velX;
  this.y += this.velY;
  // COLLISION DETECTION TIME
  Ball.prototype.collisionDetect = function () {
    console.log('Starting coll detect: ' + blocks.length)
    for (let i=0; i < blocks.length; i++) {
//      if ((this.x + this.size) < blocks[i].xB) {
//        if ((this.y - this.size) > (blocks[i].yB + blocks[i].sizey)) {
//          if ((this.y - this.size) < (blocks[i].yB + blocks[i].sizey)) {
//            console.log('collision')
//            this.color = 'red';
//          }
//        }
//        if ((this.y + this.size) < (blocks[i].yB)) {
//          if ((this.y + this.size) > (blocks[i].yB)) {
//            console.log('collision')
//            this.color = 'blue';
//          }
//        }
//      }

      if ((this.x + this.size) > blocks[i].xB && (this.x - this.size) < (blocks[i].sizex + blocks[i].xB)) {
        
        
        // THIS CHECKS FOR VERTICAL COLL.
        if ((this.y+this.size) > blocks[i].yB && (this.y-this.size) < (blocks[i].sizey + blocks[i].yB)) {
          if (this.y < (blocks[i].yB + blocks[i].sizey) && this.y > blocks[i].yB) {
            console.log('collision!');
            blocks.splice(i,1);
            this.velX = -(this.velX);
          }
          else if (this.x < (blocks[i].xB + blocks[i].sizex) && this.x > blocks[i].xB){
            console.log('collision!');
            blocks.splice(i,1);
            this.velY = -(this.velY)
          }

          else if (((this.y + this.size) === blocks[i].yB && (this.x + this.size) === blocks[i].xB) || ((this.y - this.size) === (blocks[i].yB + blocks[i].sizey) && (this.x + this.size) === blocks[i].xB) || ((this.y + this.size) === blocks[i].yB && (this.x + this.size) === (blocks[i].xB + blocks[i].sizex)) || ((this.y - this.size) === (blocks[i].yB + blocks[i].sizey) && (this.x + this.size) === blocks[i].xB + blocks[i].sizex)) {
            blocks.splice(i,1);
            console.log('corner!!!');
            this.velX = -(this.velX);
            this.velY = -(this.velY);
          }
        }
      }
//      if ((this.x - this.size) > (blocks[i].xB + blocks[i].sizex)) {
//        if ((this.y - this.size) > (blocks[i].yB + blocks[i].sizey)) {
////          console.log('below right')
//        }
//        if ((this.y + this.size) < (blocks[i].yB)) {
////          console.log('above right')
//        }
//      }
      } 
    }
  }

//      let checkDistanceX = this.x - blocks[i].xB;
//      let checkDistanceY = this.y - blocks[i].yB;
//      let distance = Math.sqrt(checkDistanceX * checkDistanceX + checkDistanceY * checkDistanceY);
//      if (distance < this.size + blocks[i].sizey) {
//        this.color = 'red';
//        blocks.splice(i,1);
//      } else {
//        this.color = 'white';
//      }
    
    //    for (let i = 0; i < blocks.length; i++) {
////      if (!(this === balls[i])) {
//        // for my case since all the balls are one size i can just do this.x - radius
////        let dx = this.x - balls[i].x;
////        let dy = this.y - balls[i].y;
//        let blocksDx = Math.abs(this.x - blocks[i].xB - 30);
////      console.log(this.x)
//        let blocksDy = Math.abs(this.y - blocks[i].yB - 12);
////        let distance = Math.sqrt(dx * dx + dy * dy);
//        if (blocksDx > (blocks[i].sizex/2 + balls[0].size)) { return false; }
//        if (blocksDy > (blocks[i].sizey/2 + balls[0].size)) { return false; }
//        if (blocksDx <= blocks[i].sizex/2) { 
//          return true 
//          balls[i].color = 'red';
//          console.log(true);
//        }
//        if (blocksDy <= blocks[i].sizey/2) { 
//          return true 
//          balls[i].color = 'red';
//          console.log(true);
        
  // THIS IS WHERE THINGS WOULD GO THAT I WANT TO HAPPEN ON COLLIDE
//          balls[i].color = this.color = 'red';
//          this.velX += 1
//          this.vely += 1
          // 'rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')';
        
      
    
  

let balls = [];
let blocks = []; 
// woohoo figured out nested for loops, this will create rows of 20 blocks
for (let s=0;s<15;s++){
  for (let r=0;r<15;r++) {
      let block = new Blocks(r, s);
      blocks.push(block);
  }
}

// setting a random color for the board
let randomColor = ['rgba(50,50,50,.75)','rgba(50,0,50,.75)','rgba(0,50,50,.75)','rgba(50,0,0,.75)','rgba(0,50,0,.75)','rgba(0,0,50,.75)'];
let pickColor = randomColor[random(0,randomColor.length-1)];


function loop () {
  //this opacity gives us the ball tails
  gameBoard.fillStyle = pickColor;
  gameBoard.fillRect(0, 0, width, height);

  while (balls.length < 1) {
    let ball = new Ball();
    balls.push(ball);
  };
  for (let j=0;j<blocks.length;j++){
    blocks[j].draw();
    //blocks[j].update();
  };
  
    balls[0].draw();
    balls[0].update();
    balls[0].collisionDetect();

  
  //this constantly runs the animation function
  requestAnimationFrame(loop);
}
loop();
console.log(blocks.length)






