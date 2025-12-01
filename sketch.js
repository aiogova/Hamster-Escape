/*
Name: Anastasia Iogova
Course: CISC 298
Due Date: May 18 2023
Final Project
Folder Name: IogovaCISC298_finalProject
File Name: sketch.js
*/

const gravity = 0.5;
const friction = 0.9;
const maxHealth = 3;
let pawArray = [];
let healthArray = [];
let bgCol;
let keepPlaying = true;
let textCol;
let retryBtn;
let gameOverCount = 0;
let points = 0;
let health = 3;
// let specificPawIndex;
let hit = 0;
let goalSubmitted = false;
let goal;
let up = true;

let yoff = 0.0;
let yinc = 0.0001;

let xoff = 0.0;
let xinc = 0.0001;

let inp, submit;

let clickCount = 0;

let every3Second;
let halfOfSecond, thirdOfSecond;
let randomColor;
let frate = 60;
let onEdge = false;
let accelerateMode = false;

let hamsterImg, meow1, meow2, meow3, gameOverSound;
let meowArray = [];

function preload() {
    hamsterImg = loadImage('graphic/Hamster-PNG-Picture.png'); //https://www.pngarts.com/explore/137136
    foodBowl = loadImage('graphic/foodBowl.png');// https://www.alamy.com/full-dog-food-bowl-isolated-on-white-background-image355823419.html

    catImg = loadImage('graphic/black_cat.png'); //https://clipartix.com/black-cat-clipart-2-image-59352/

    jumpScareImg = loadImage('graphic/spookyCat.png'); //https://imgbin.com/png/vxtbyTdg/scary-black-cat-png

    spookyBackground = loadImage('graphic/spookyBackground.jpg'); //https://www.istockphoto.com/vector/happy-halloween-purple-violet-background-with-full-moon-dead-tree-and-bat-vector-gm1339748320-420007174

    meow1 = loadSound('sounds/110011__tuberatanka__cat-meow.wav');
    meow2 = loadSound('sounds/362652__trngle__cat-meow.wav');
    meow3 = loadSound('sounds/415209__inspectorj__cat-screaming-a.wav');
    gameOverSound = loadSound('sounds/620792__melokacool__game-over.wav');

    song = loadSound('sounds/the-hampsterdance-song.mp3'); // downloaded from YouTube https://www.youtube.com/watch?v=H9K8-3PHZOU
}

function setup() {
    frameRate(frate);
    every3Second = frate * 3;
    halfOfSecond = frate/2;
    thirdOfSecond = frate/3;
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    textAlign(CENTER);
    bgCol = color(102, 102, 255);
    textCol = color(255, 255, 255);
    textColBlack = color(0,0,0);
    randomColor = color(random(0,255), random(0,255), random(0,255));
    //textSize(40);

    meowArray.push(meow1);
    meowArray.push(meow2);
    meowArray.push(meow3);

    meow1.playMode('restart');
    meow2.playMode('restart');
    meow3.playMode('restart');
    gameOverSound.playMode('restart');
    song.playMode('restart');

    inp = createInput('');
    inp.position(width/2-100, height/2+140);

    submit = createInput('Submit', 'submit');
    submit.position(width/2-30, height/2+170);
    submit.mousePressed(getUserGoal);
    
    // create objects
    hamster = new Hamster();
    cat = new Cat();
    jumpScare = new Jumpscare();
    grassAndSky = new BackgroundLandscape();
    cage = new Cage();
    sun = new Sun();
    moon = new Moon();

    
    // generate lower paws
    for (let i = 0; i < 100; i++) {
        paw = new PawLower();
        paw.x += (600 * i);
        paw.hitBoxPawLowerX += 600 * i;
        pawArray.push(paw);
    }

    // generate upper paws
    for (let i = 0; i < 100; i++) {
        paw = new PawUpper();
        paw.x += (600 * i);
        paw.hitBoxPawUpperX += 600 * i;
        pawArray.push(paw);
    } 

    // generate health points
    for (let i = 0; i < 3; i++){
        hp = new HealthPoint;
        hp.x += (40 * i);
        healthArray.push(hp);
    }

    stroke(0,0,0);

}

function draw() {
    background(bgCol); 
   
    // if the user is playing
    if (keepPlaying == true && goalSubmitted == true) {
        
        // play the song the first time
        if (clickCount == 1) {
            song.play();
            clickCount++;
        }
        // play the song again when it stops playing
        else if (!(song.isPlaying())) {
            song.play();
        }


        grassAndSky.display();
        sun.display();
        sun.move();
        moon.display();
        moon.move();

        strokeWeight(2);

        // on every round EXCEPT the first round of the game, remove the button
        if (gameOverCount != 0) {
            retryBtn.remove();
        } 
        // only on the first round, remove the input fields
        else 
        {
            inp.remove();
            submit.remove();
            bgCol = color(102, 255, 255);

        }

        // lose
        if (health == 0) {
            gameOver();
        }

        // win
        if (points == goal && health > 0) {
            youWin();
        }

        // move the hamster up and down
        if (keyIsDown(32) && !accelerateMode) {
            hamster.y -= 7;
            hamster.hamHitBoxY -= 7;
        } 
        else if (keyIsDown(32) && accelerateMode) {
            hamster.y -= 15;
            hamster.hamHitBoxY -= 15;
        }

        if (accelerateMode) {
            text("ACCELERATING", width/2, 75);

        }

        // display an move hamster
        hamster.gravitationalPull();
        hamster.constrain();
        hamster.display();
        
        // display and move paws
        for (let i=0; i<pawArray.length; i++) {
            pawArray[i].move();
            pawArray[i].display();
            pawArray[i].moveUpAndDown();
            if (pawArray[i].x == hamster.x) {
                points++;
            }

        } 

        hamster.checkCollisions();

        // display health points
        for (let i = 0; i < healthArray.length; i++) {
            healthArray[i].display();
        }

        fill(0,0,0);
        textSize(30);
        text("Points: " + points, width-110, 75);
        text("Health: " + health, 110, 75);
        text("Goal: " + goal, width-300, 75)



        if ((frameCount % every3Second) == 0) {
            // push();
           // fill(randomColor);
           // circle(random(0,width), random(width,height), 500);
            console.log("This happens every 3 seconds");
            // pop();
        }

        // add  jumpscare one point before the user wins
        if (points == goal-1) {
            jumpScare.display();

            if ((frameCount % halfOfSecond) == 0) {
                jumpScare.hideImage();
            }
        }

        // change background day and night theme
        if (sun.sunX == -250) {
            grassAndSky.skyCol = color(0, 51, 204);
            stroke(255,255,255);
        }
        else if (moon.moonX == -250) {
            grassAndSky.skyCol = color(0, 204, 255);
            stroke(0,0,0);
        }


    }
    // if the user loses
    else if (keepPlaying == false && goalSubmitted == true && points != goal && health == 0) {

        image(spookyBackground, 0,0, width, height);

        fill(textColBlack);
        textSize(40);
        text("Game OVER!", width/2, height/2);

        hamster.moveRightFull();
        hamster.display();
        
        cat.moveRight();
        cat.display();
    }
    // if the user wins
    else if (keepPlaying == false && goalSubmitted == true && points == goal && health > 0) {
        grassAndSky.display();
        sun.display();
        sun.move();
        moon.display();
        moon.move();

        if (sun.sunX <= -250) {
            grassAndSky.skyCol = color(0, 51, 204);
            stroke(255,255,255);

        }
        else if (moon.moonX <= -250) {
            grassAndSky.skyCol = color(0, 204, 255);
            stroke(0,0,0);

        }

        cage.display();

        fill(textCol);
        textSize(40);
        //strokeWeight(3);
        text("YOU WIN!", width/2 - 200, height/2);

        hamster.col = color(186, 133, 72);
        onEdge = false;

        hamster.moveRight();
        hamster.jumpUp();  
        hamster.jumpDown();
        hamster.display();
        
    }
    // title screen
    else {
        fill(textCol);

        textSize(60);
        text("Hamster Escape", width/2, height/2 - 200);

        textSize(25);
        text("Press and hold spacebar to move up", width/2, height/2 - 150);
        text("Release spacebar to move down", width/2, height/2 - 110);
        text("Press shift to go into acceleration mode", width/2, height/2 - 70);
        text("Dodge the cat paws to escape from the cat!", width/2, height/2 - 30);
        text("You gain a point every time you go past a cat paw", width/2, height/2 + 10);
        text("Win when you reach your desired number of points", width/2, height/2 + 50);



        //textSize(20);
        text("How many points do you want to get? (3-200)", width/2, height/2 + 120);

        image(hamsterImg, 70, 0, 300, 200);
        image(hamsterImg, 70, height/2 - 110, 300, 200);
        image(hamsterImg, 70, height-220, 300, 200);

        image(hamsterImg, width-350, 0, 300, 200);
        image(hamsterImg, width-350, height/2 - 110, 300, 200);
        image(hamsterImg, width-350, height-220, 300, 200);
    }
   

}


function keyPressed() {
    // check if shift key is pressed
    if (keyCode === SHIFT) {
        accelerateMode = !accelerateMode;
    }
   
}


function getUserGoal () {
    console.log('You typed: ', inp.value());
    goal = parseInt(inp.value());
    
    // data validation
    if (goal >= 3 && goal <= 200) {
        goalSubmitted = true;
        clickCount++;
    }
    
}


function youWin() {
    keepPlaying = false;

    bgCol = color(102, 255, 102);  

}

function gameOver() {
    gameOverSound.play();
    keepPlaying = false;
    gameOverCount++;
    song.stop();
    hamster.x = hamster.xSaved;

    bgCol = color(252, 186, 3);  

    retryBtn = createButton('Retry');
    retryBtn.position(width/2-35,height/2-150);
    retryBtn.mousePressed(retry);
}

function retry() {
    keepPlaying = true;
    points = 0;
    health = 3;

    hamster.x = hamster.xSaved;

    cat.x = cat.x_start;

    gameOverSound.stop();

    // generate health points again
    for (let i = 0; i < 3; i++){
        hp = new HealthPoint;
        hp.x += (40 * i);
        healthArray.push(hp);
    }

    bgCol = color(102, 255, 255);

    // move paws back to their starting locations
    for (let i = 0; i < pawArray.length/2; i++) {
        pawArray[i].x = pawArray[i].x_start;
        pawArray[i].hitBoxPawLowerX = pawArray[i].initialHitBoxPawLowerX;
        pawArray[i].x += 600 * i;
        pawArray[i].hitBoxPawLowerX += 600 * i;
    }

    let count = 0;
    for (let i = pawArray.length/2; i < pawArray.length; i++) {
        pawArray[i].x = pawArray[i].x_start;
        pawArray[i].hitBoxPawUpperX = pawArray[i].initialHitBoxPawUpperX;
        pawArray[i].x += 600 * count;
        pawArray[i].hitBoxPawUpperX += 600 * count;
        count++;
    }
}


// function to define Hamster class
class Hamster {
    constructor() {
        // construct the object
        this.x = 150;
        this.xSaved = this.x;
        this.y = height/2;
        this.ySaved = this.y;
        this.col = color(186, 133, 72);
        this.colEyes = color(0,0,0);
        this.colWhite = color(255,255,255);
        this.colRed = color(255,0,0);
        this.diam = 40;
        this.diamOrig = this.diam;
        this.rad = this.diam * 0.5;
        this.ydir = 3.2;

        this.hamHitBoxX = this.x + 10;
        this.hamHitBoxY = this.y - 20;
        this.savedHamHitBoxY = this.hamHitBoxY;
        this.hamHitBoxD = this.diam * 2;
        this.hamHitBoxR = this.hamHitBoxD/2;
    }

    display() {

        // strokeWeight(3);
        let randVal = random(-10,10);

        // fill(this.colWhite);
        // ellipse(this.hamHitBoxX, this.hamHitBoxY, this.hamHitBoxD, this.hamHitBoxD);

        fill(this.col);

        if (!onEdge) {
            // body
            ellipse(this.x, this.y, this.diam + 20, this.diam);

            // head
            circle(this.x + 30, this.y - 25, this.diam - 5);

            // ears
            circle(this.x + 15, this.y - 42, this.diam - 30);
            circle(this.x + 45, this.y - 42, this.diam - 30);

            // legs
            ellipse(this.x - 25, this.y + 15, this.diam - 30, this.diam - 20);
            ellipse(this.x + 25, this.y + 15, this.diam - 30, this.diam - 20);

            // tail
            circle(this.x - 32, this.y - 10, this.diam - 30);

            // eyes
            fill(this.colEyes);
            circle(this.x + 25, this.y - 30, this.diam - 36);
            circle(this.x + 45, this.y - 30, this.diam - 36);


            // nose

            //image(hamsterImg, this.hamHitBoxX-60, this.hamHitBoxY-45, this.diam*4, this.diam*3);
        }
        else {
            // body
            ellipse(this.x + randVal, this.y + randVal, this.diam + 20, this.diam);

            // head
            circle(this.x + 30 + randVal, this.y - 25 + randVal, this.diam - 5);

            // ears
            circle(this.x + 15 + randVal, this.y - 42 + randVal, this.diam - 30);
            circle(this.x + 45 + randVal, this.y - 42 + randVal, this.diam - 30);

            // legs
            ellipse(this.x - 25 + randVal, this.y + 15 + randVal, this.diam - 30, this.diam - 20);
            ellipse(this.x + 25 + randVal, this.y + 15 + randVal, this.diam - 30, this.diam - 20);

            // tail
            circle(this.x - 32 + randVal, this.y - 10 + randVal, this.diam - 30);

            // eyes
            fill(this.colEyes);
            circle(this.x + 25 + randVal, this.y - 30 + randVal, this.diam - 35);
            circle(this.x + 45 + randVal, this.y - 30 + randVal, this.diam - 35);

        }

       

    }

    // when hamster hits edge of window
    constrain() {
        if (this.y > height-this.rad) {
            onEdge = true;
            this.y = height-this.rad;
            this.hamHitBoxY = height-this.rad;
        } else if (this.y < this.rad) {
            onEdge = true;
            this.y = this.rad;
            this.hamHitBoxY = this.rad;
        }
        else {
            onEdge = false;
        }  
    }

    gravitationalPull() {
        if (!accelerateMode) {
            this.ydir = 3.2;
        }
        else {
            this.ydir = 7;
        }

        this.y += this.ydir;
        this.hamHitBoxY += this.ydir;
        
    }

    
    moveRight() {
        this.x += 5;
        
        if (this.x >= width-375) {
            this.x = width-375;
        } 
        else 
        {
            this.y = height/2+50;
            this.yEndPos = this.y;
        }
    }

    moveRightFull() {
        this.x += 6;
        this.y = height/2 + 100;
    }

    jumpUp() {
        if (this.x == width-375 && up == true) {
            this.y -= 2;
        }

        if (this.y == this.yEndPos - 100) {
            up = false;
        }
    }

    jumpDown() {
        if (this.x == width-375 && up == false) {
            this.y += 2;
        }

        if (this.y == this.yEndPos) {
            up = true;
        }
    } 

    checkCollisions() {
        this.col = color(186, 133, 72);
        // what happens if hamster collides with paw (the paw hitbox is only on the top of the paw because I used circle collisions)
        for (let i=0; i<pawArray.length; i++)  {
            if (dist(this.hamHitBoxX, this.hamHitBoxY, pawArray[i].hitBoxPawLowerX, pawArray[i].hitBoxPawLowerY) <= this.hamHitBoxR + pawArray[i].hitBoxPawLowerR) {
                if (frameCount > hit) {
                    health--;
                    hit = frameCount + 120;
                    this.col = color(255, 0, 0);
                    healthArray.pop();

                    let s = floor(random(0,meowArray.length));
                    meowArray[s].play();
                }
                if (frameCount < hit) {
                    this.col = color(255, 0, 0);

                }
            } 
            
            else if( dist(this.hamHitBoxX, this.hamHitBoxY, pawArray[i].hitBoxPawUpperX, pawArray[i].hitBoxPawUpperY) <= this.hamHitBoxR + pawArray[i].hitBoxPawUpperR) {
                if (frameCount > hit) {
                    health--;
                    hit = frameCount + 120;
                    this.col = color(255, 0, 0);
                    healthArray.pop();
                    
                    let s = floor(random(0,meowArray.length));
                    meowArray[s].play();
                }
                if (frameCount < hit) {
                    this.col = color(255, 0, 0);

                }
            }

        }
    }
}

// function to define PawLower class
class PawLower {
    constructor() {
        // construct the object
        this.x = width;
        this.x_start = this.x;
        this.y = random(150,height);
        this.colPaw = color(102, 0, 102);
        this.colPawPads = color(255, 102, 204);
        this.colWhite = color(255,255,255);
        this.colBlack = color(0,0,0);
        this.colOrange = color(255, 153, 51);
        this.w = 90;
        this.h = height - this.y;
        this.xdir = -2;
        this.diam = 20;

        this.hitBoxPawLowerX = this.x + 45;
        this.initialHitBoxPawLowerX = this.hitBoxPawLowerX;
        this.hitBoxPawLowerY = this.y + 50;
        this.hitBoxPawLowerD = this.diam*5.3;
        this.hitBoxPawLowerR = this.hitBoxPawLowerD/2;

    }

    display() {
        //fill(this.colWhite);
        //circle(this.hitBoxPawLowerX, this.hitBoxPawLowerY, this.hitBoxPawLowerD);

        fill(this.colOrange);
        rect(this.x, this.y, this.w, this.h);

        fill(this.colPawPads);
        circle(this.x + 15, this.y + 25, this.diam);
        circle(this.x + 45, this.y + 20, this.diam);
        circle(this.x + 75, this.y + 25, this.diam);

        circle(this.x + 45, this.y + 60, this.diam + 30);
    }

    move() {
        this.x += this.xdir;
        this.hitBoxPawLowerX += this.xdir;
    }

    moveUpAndDown() {     
        // use perlin noise to move paws up and down
        let n = noise(this.x/100 + yoff) * height;
        yoff += yinc;

        this.y = n;
        this.h = height - this.y;

        this.hitBoxPawLowerY = n + 50;
            
    }
}






// function to define PawUpper class
class PawUpper {
    constructor() {
        // construct the object
        this.x = width + 300;
        this.x_start = this.x;
        this.y = 0;
        this.colPaw = color(102, 0, 102);
        this.colPawPads = color(255, 102, 204);
        this.colWhite = color(255,255,255);
        this.colBlack = color(0,0,0);
        this.colOrange = color(255, 153, 51);
        this.w = 90;
        this.h = random(150, height-150);
        this.xdir = -2;
        this.diam = 20;
        this.rad = this.diam/2;

        this.hitBoxPawUpperX = this.x + 45;
        this.initialHitBoxPawUpperX = this.hitBoxPawUpperX;
        this.hitBoxPawUpperY = this.h - 50;
        this.hitBoxPawUpperD = this.diam*5.3;
        this.hitBoxPawUpperR = this.hitBoxPawUpperD/2;
    }

    display() {

        //fill(this.colWhite);
        //circle(this.hitBoxPawUpperX, this.hitBoxPawUpperY, this.hitBoxPawUpperD);

        fill(this.colOrange);
        rect(this.x, this.y, this.w, this.h);

        fill(this.colPawPads);
        circle(this.x + 15, this.h - 25, this.diam);
        circle(this.x + 45, this.h - 20, this.diam);
        circle(this.x + 75, this.h - 25, this.diam);

        circle(this.x + 45, this.h - 60, this.diam + 30);
    }

    move() {
        this.x += this.xdir;
        this.hitBoxPawUpperX += this.xdir;

    }

    moveUpAndDown() {           
        // use perlin noise to move paws up and down
        let n = noise(this.x/100 + xoff) * height;
        xoff += xinc;

        this.h = height - n;

        this.hitBoxPawUpperY = this.h - 50;
        
    }
}

class HealthPoint {
    constructor() {
        this.x = 70;
        this.y = 100;
        this.diam = 20;
        this.col = color(255, 0, 255);
    }

    display() {
        fill(this.col);

        circle(this.x, this.y, this.diam);
    }

}

class Cage {
    constructor() {
        this.x = width-500;
        this.y = height/2 - 105;
        this.w = 300;
        this.h = 180;
        this.colBlack = color(255,255,255);
        this.colRoof = color(204, 51, 255);
        this.colWall = color(204, 153, 255);
    }

    display() {
        //fill(this.colBlack);

        // building house from lines
        line(this.x, this.y, this.x + this.w, this.y);
        line(this.x, this.y + this.h, this.x + this.w, this.y + this.h);

        line(this.x, this.y, this.x, this.y + this.h);
        line(this.x + this.w, this.y, this.x + this.w, this.y + this.h);

       // line(this.x, this.y, this.x + this.w/2, this.y - this.h/2);
       // line(this.x + this.w, this.y, (this.x+this.w)- (this.w/2), this.y - this.h/2);


        // building house from rectangle and triangle
        fill(this.colWall);
        rect(this.x, this.y, 300, 180);


        fill(this.colRoof);
        triangle(this.x, this.y, this.x + this.w/2, this.y - this.h/2, this.x + this.w, this.y);


        image(foodBowl, this.x + 165, this.y + 118, 90, 80);

    }
}

class BackgroundLandscape {
    constructor() {
        this.w = width;
        this.h = height;
        this.grassWidth = this.w;
        this.grassHeight = this.h/3 + 50;
        this.grassCol = color(0, 153, 51);
        this.skyWidth = this.w;
        this.skyHeight = ((this.h/3) * 2) - 50;
        this.skyCol = color(0, 204, 255);

        this.grassX = 0;
        this.grassY = this.grassX + this.skyHeight;
        this.skyX = 0;
        this.skyY = 0;   
    }

    display() {
        push();
        noStroke();

        fill(this.grassCol);
        rect(this.grassX, this.grassY, this.grassWidth, this.grassHeight);

        fill(this.skyCol);
        rect(this.skyX, this.skyY, this.skyWidth, this.skyHeight);

        

        pop();
    }
}

class Cat {
    constructor() {
        this.x = -250;
        this.x_start = this.x;
        this.y = height/2;
        this.w = 300;
        this.h = 200;
    }

    display() {
        image(catImg, this.x, this.y, this.w, this.h);
    }

    moveRight() {
        this.x += 5;
    }
}

class Sun {
    constructor() {
        this.sunX = width - 100;
        this.sunY = 170;
        this.sunD = 150;
        this.sunCol = color(255, 255, 0);
    }

    display() {
        push();

        noStroke();
        fill(this.sunCol);
        circle(this.sunX, this.sunY, this.sunD);

        stroke(this.sunCol);
        strokeWeight(25);
        line(this.sunX-150, this.sunY, this.sunX+150, this.sunY);
        line(this.sunX, this.sunY-150, this.sunX, this.sunY+150);
        line(this.sunX-100, this.sunY+100, this.sunX+100, this.sunY-100);
        line(this.sunX-100, this.sunY-100, this.sunX+100, this.sunY+100);

        pop();
    }

    move() {
        this.sunX -= 1;

        if (this.sunX <= -300) {
            this.sunX = (width*2) + 800;
        }
    }
}

class Moon {
    constructor() {
        this.moonX = (width*2 - 100) + 500;
        this.moonY = 170;
        this.moonD = 150;
        this.moonCol = color(255, 255, 204);
        this.otherCol = color(255, 255, 153);
    }

    display() {
        push();

        noStroke();
        fill(this.otherCol);
        circle(this.moonX, this.moonY, this.moonD);

        fill(this.moonCol);
        circle(this.moonX-30, this.moonY-10, this.moonD/4);
        circle(this.moonX+35, this.moonY+20, this.moonD/5);
        circle(this.moonX+30, this.moonY-35, this.moonD/5);



        pop();
    }

    move() {
        this.moonX -= 1;

        if (this.moonX <= -300) {
            this.moonX = (width*2) + 800;
        }
    }


}

class Jumpscare {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = width;
        this.h = height;
    }

    display() {
        image(jumpScareImg, this.x, this.y, this.w, this.h);
    }

    hideImage() {
        this.x = 1000000;
        this.y = 1000000;
    }
}