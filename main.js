// First part of the game, choose the difficulty which changes some parameters within the game
let buttons = document.getElementsByTagName('button')
let clickedButton = null;
let diffArray = [{name: 'Demo', lives: 2, rows: 1, column: 1},
                {name : 'Easy', lives: 5, rows: 5, column: 15},
                {name: 'Medium', lives: 4, rows: 10, column: 15},
                {name: 'Hard', lives: 3, rows: 15, column: 15}];
let form = document.getElementById('form');


// the game function, loads after a difficulty is picked
function game(obj) {
  let container = document.getElementById('playfield');
  let gameBoard = container.getContext('2d');
  let width = container.width = 1200;
  let height = container.height = 700;

  // using random a lot, so utilizing this function instead of retyping all the time
  function random (min, max) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
  };

  // this models the blocks, where they start and their placement
  function Blocks (posx, posy) {
    this.xB = 0 + (posx * 80);
    this.yB = 48 + (posy * 25);
    this.color = 'rgb('+random(0,220)+','+random(0,220)+','+random(0,220)+')';
    this.border = 'black';
    this.sizex = 80;
    this.sizey = 24;
  };

  // Time to model the balls
  function Ball () {
    this.x = 600;
    this.y = 650;
    this.velX = 4.5;
    this.velY = -4.5;
    this.color = 'white';
    this.size = 10;
  };
  
  // this models the paddle
  function Paddle () {
    this.xP = 500
    this.yP = 680
    this.color = 'lightblue';
    this.sizeXp = 200
    this.sizeYp = 10
  }

  //This draws the ball with the object's attributes.  this is based off of the Bouncing Balls tutorial from mozilla since we haven't really used canvases, drawing or that stuff.  This tutorial gave me a simple foundation for the game that i then took and made my own, utilizing some tools that it taught me. The only real things that i needed to keep similar to the tutorial was the ball itself, the looping function, and that random function (although i was going to make that anyway) but even those i added much more on top of.  link: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_building_practice
  Ball.prototype.draw = function () {
    gameBoard.beginPath();
    gameBoard.fillStyle = this.color;
    gameBoard.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    gameBoard.fill();
  }
  //Drawing each block
  Blocks.prototype.draw = function () {
    gameBoard.beginPath();
    gameBoard.lineWidth = '2';
    gameBoard.strokeStyle = 'black';
    gameBoard.fillStyle = this.color;
    gameBoard.rect(this.xB, this.yB, this.sizex, this.sizey);
    gameBoard.stroke();
    gameBoard.fill();
  }
  //Drawing the paddle
  Paddle.prototype.draw = function () {
    gameBoard.beginPath();
    gameBoard.lineWidth = '2';
    gameBoard.strokeStyle = 'black';
    gameBoard.fillStyle = this.color;
    gameBoard.rect(this.xP, this.yP, this.sizeXp, this.sizeYp);
    gameBoard.stroke();
    gameBoard.fill();
  }
  //Declare score and draw it
  let score = 0;
  let drawScore = function () {
    gameBoard.beginPath();
    gameBoard.font = '22px Sans-serif';
    gameBoard.fillStyle = 'white';
    gameBoard.fillText('Score: '+score, 25, 25)
  }
  //Declare lives variable and draw the lives counter
  let lives = obj.lives;
  let drawLives = function () {
    gameBoard.fillText('Lives: '+lives, 175, 25)
  }
  //Declare difficulty variable and draw it
  let diff = obj.name;
  let drawDiff = function () {
    gameBoard.fillText('Difficulty: '+diff, 300, 25)
  }
  //Draw the congrats for winning
  let drawWin = function() {
    gameBoard.font = '50px Sans-serif';
    gameBoard.fillStyle = 'rgb('+random(50,220)+','+random(0,220)+','+random(0,220)+')';
    gameBoard.fillText('Congratulations, You Win!', 315, 400);
  }
  //Draw the game over for losing
  let drawLose = function () {
    gameBoard.font = '50px Sans-serif';
    gameBoard.fillText('Game over, Refresh to play again', 220, 500)
  }

  //Function for moving the paddle with the cursor, this we haven't learned so i looked up how to do it.  It calculates the relative x position by subtracting the offest from side of the browser window to canvas.  then says if the mouse is within the window, the x position of the paddle's middle is set to the mouse x position and then draw it each time to update the paddle.
  //taken from: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Mouse_controls
  function mouseMoveHandler(e) {
    let relativeX = e.clientX - container.offsetLeft;
    if(relativeX > 0 && relativeX < container.width) {
      paddles[0].xP = relativeX - paddles[0].sizeXp/2;
    }
  }

  //Declaring the force variable to be used in paddle bouncing physics
  let force;

  //Collision detection for the ball... first off the walls, then the paddle, then the blocks.  It's not 100% perfect but pretty darn close
  Ball.prototype.update = function () {
    // bounce from the right side
    if ((this.x + this.size) >= width) {
      this.velX = increaseSpeed(this.velX);
    }
    //bounce from the left side
    if ((this.x - this.size) <= 0) {
      this.velX = increaseSpeed(this.velX);
    }
    //bounce from the top
    if ((this.y - this.size) <= 0) {
      this.velY = increaseSpeed(this.velY);
    }
    //detection from the bottom, pops the balls array, subtracts a life, and alerts user they lost a life or lost if no lives left, also draws gameover if lose all lives
    if ((this.y - this.size) >= height) {
      balls.pop();
      lives--;
      if (lives > 0) {
        alert('you lost a life!, you have '+lives+' lives left!')
        balls.push(new Ball);  
      } else {
        drawLives();
        drawScore();
        drawLose();
        alert('You Lost all lives, Game Over!')
      }
    }
    //Paddle Bounce here!
    if ((this.y + this.size) >= paddles[0].yP){
      if ((this.x + this.size) >= paddles[0].xP && (this.x - this.size) <= (paddles[0].xP + paddles[0].sizeXp)) {
        //trial and error led me to pull out the force calculation because leaving it in the vector function was giving incorrect values
        force = Math.sqrt((this.velX * this.velX) + (this.velY * this.velY))
        this.velX = -(vectorsX(force));
        this.velY = -(vectorsY(force));
      }
      // Bounce from side of paddle
       else if ((this.x + this.size) === paddles[0].yP && (this.y+this.size) < (paddles[0].yP + paddles[0].sizeYp) && (this.y) > paddles[0].yP) {
        force = Math.sqrt((this.velX * this.velX) + (this.velY * this.velY));
        this.velX = -(vectorsX(force));
        this.velY = -(vectorsY(force));
      }
    }

    // adds the velocity to the position for each time it's called, which is constant
    this.x += this.velX;
    this.y += this.velY;

    // collision detection for the blocks
    Ball.prototype.collisionDetect = function () {
      for (let i=0; i < blocks.length; i++) {

        //this statement checks if the ball is within the x coordinate range that block[i] inhabits
        if ((this.x + this.size) > blocks[i].xB && (this.x - this.size) < (blocks[i].sizex + blocks[i].xB)) {

          //this then checks if the ball y coord is within the block[i]y coord
          if ((this.y+this.size) > blocks[i].yB && (this.y-this.size) < (blocks[i].sizey + blocks[i].yB)) {
            // this then checks if ball y coord is within 
            if (this.y < (blocks[i].yB + blocks[i].sizey) && this.y > blocks[i].yB) {
              console.log('collision!');
              blocks.splice(i,1);
              this.velX = increaseSpeed(this.velX);
              score += 10;
            }
            else if (this.x < (blocks[i].xB + blocks[i].sizex) && this.x > blocks[i].xB){
              console.log('collision!');
              blocks.splice(i,1);
              this.velY = increaseSpeed(this.velY);
              score += 10;
            }
            // i wrote this on the desk and it made sense at the time.  it checks for corner hits, which are rare but will screw up the physics if not accounted for
            else if (((this.y + this.size) === blocks[i].yB && (this.x + this.size) === blocks[i].xB) || ((this.y - this.size) === (blocks[i].yB + blocks[i].sizey) && (this.x + this.size) === blocks[i].xB) || ((this.y + this.size) === blocks[i].yB && (this.x + this.size) === (blocks[i].xB + blocks[i].sizex)) || ((this.y - this.size) === (blocks[i].yB + blocks[i].sizey) && (this.x + this.size) === blocks[i].xB + blocks[i].sizex)) {
              blocks.splice(i,1);
              console.log('corner!!!');
              this.velX = increaseSpeed(this.velX);
              this.velY = increaseSpeed(this.velY);
              score += 10;
            }
          }
        }
      } 
    }
  }

  //function to increase speed on collisions, maxes out at 10
  function increaseSpeed (vel) {
    if (Math.abs(vel) < 10) {
      return vel = -(vel * 1.01)
    } else {
      return vel = -(vel)
    }
  }

  //function for the math behind the x vector curved deflection of the paddle, using trig i had to remember from long ago
  function vectorsX(f) {
    let newx = f * Math.cos((balls[0].x + 15 - paddles[0].xP)/230 * Math.PI);
    return newx;
  }
  //2nd function for y vector in curved deflection.  i'm using 230 because i dont want the edges of the paddle to just shoot the ball in only the x axis
  function vectorsY(f) {
    let newy = f * Math.sin((balls[0].x + 15 - paddles[0].xP)/230 * Math.PI);
    return newy;
  }
  
  //declaring the empty arrays to house the entities, just made manipulating them easier especially when using more than 1 life
  let paddles = [];
  let balls = [];
  let blocks = []; 


  //  nested for loop this will create rows of 15 blocks (except for demo mode), with changes to rows by the difficulty (max is 225 blocks)
  for (let s=0;s<obj.rows;s++){
    for (let r=0;r<obj.column;r++) {
        let block = new Blocks(r, s);
        blocks.push(block);
    }
  }

  // array for canvas background colors, opacity at .75 to see ball trails
  let randomColor = ['rgba(50,50,50,.75)','rgba(50,0,50,.75)','rgba(0,50,50,.75)','rgba(50,0,0,.75)','rgba(0,50,0,.75)','rgba(0,0,50,.75)'];
  let pickColor = randomColor[random(0,randomColor.length-1)];

  //Mouse event listener for moving the paddle
  document.addEventListener('mousemove', mouseMoveHandler, false)

  // this is the big function that runs frame by frame completing all that's called inside it
  function loop () {
    //picks color for background and draws the edges of the canvas
    gameBoard.fillStyle = pickColor;
    gameBoard.fillRect(0, 0, width, height);
    
    // creates a new ball and pushes it into the balls array 
    while (balls.length < 1) {
      let ball = new Ball();
      balls.push(ball);
    };
    //creates a paddle and pushes it into the paddles array
    while (paddles.length < 1) {
      let paddle = new Paddle();
      paddles.push(paddle);
    };
    //draws the blocks for the predetermined number
    for (let j=0;j<blocks.length;j++){
      blocks[j].draw();
    };
    //draws the paddle
    paddles[0].draw();
    //draws the ball, then calls the update and collision functions for it
    balls[0].draw();
    balls[0].update();
    balls[0].collisionDetect();
    //draws the score, lives and difficulty picked on the canvas
    drawScore();
    drawLives();
    drawDiff();
    //detects if the game is over or not, i decided to make the bottom border allow for collisions after you win the game so you can just watch the ball bounce around when you win, also the draw win has a nice color animation on it
    if (blocks.length > 0) {
      requestAnimationFrame(loop);
    } else {
      requestAnimationFrame(loop);
      drawWin();
      //on win i set it to just bounce around the canvas without dying
      if ((balls[0].y + balls[0].size) >= height) {
        balls[0].velY = increaseSpeed(balls[0].velY)
      }
    }
  }
  loop();
}

//this takes in the button press, and tells the game what difficulty the player picked while also waiting to load the game until picked
clickedButton = function() {
  for (let i=0;i<buttons.length;i++){
    buttons[i].addEventListener('click', function() {
      let val = buttons[i].value;
      game(diffArray[val])
      document.querySelector('body').removeChild(form)
    });
  };
};

clickedButton();