var trex, trex_running,trex_collided;

var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score,highscore;

var gameState,PLAY,END;

var gameoverimage,restartimage,gameOver,restart;

let checkpointsound,diesound,jumpsound;

camera.on();

function preload(){
  //preloading all images
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  
  trex_collided = loadImage("trex_collided.png");
    
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameoverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
  
  checkpointsound = loadSound("checkPoint.mp3");
  diesound = loadSound("die.mp3");
  jumpsound = loadSound("jump.mp3");
}

function setup() {
  createCanvas(600,400);
  
  //creating sprites
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -6;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  gameOver = createSprite(300,90);
  gameOver.addImage(gameoverimage);
  gameOver.scale = 0.5;
  restart = createSprite(300,130);
  restart.addImage(restartimage);
  restart.scale = 0.5;
  gameOver.visible = false;
  restart.visible = false;
  
  score = 0;
  
  highscore = 0;
  
  PLAY = 1;
  END = 0;
  gameState = PLAY;
}

function draw() {
  background("white");
  
  camera.y = trex.y;

  //setting text
  fill("black");
  textFont("Algerian");
  textSize(25);
  text("H I       "+ highscore, 350,50);
  text(score, 500,50);
  
  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/40);
    
    //giving velocity to the ground
    ground.velocityX = -(6 + 2*score/100);
  
    //telling trex to jump and play when'space' is pressed
  if(keyDown("space") && trex.y > 160){
    trex.velocityY = -13;
    jumpsound.play();
  }
  
  //addidng gravity
  trex.velocityY = trex.velocityY + 0.8;
  
  //
  if (score > 0 && score % 100 === 0){
      checkpointsound.play();
  }
    
  if (score > 400 && score < 700 || score > 1100 && score < 1400 || score > 1800 && score < 2100 || score > 2500 && score < 2800){
      background("black");
      fill("white");
      textFont("Algerian");
      textSize(25);
      text("H I       "+ highscore, 350,50);
      text(score, 500,50);
  }
    
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  //spawn the clouds
  spawnClouds();
    
  //spawn the obstaclesGroup
  spawnObstacles();
 
  //telling to end game when trex is touching obstaclesGroup  
  if(obstaclesGroup.isTouching(trex)){
    gameState = END;
    diesound.play();
  }
  }
  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //setting highscore
    if(score > highscore){
      highscore = score;
    }
    
    //telling to reset when mouse is pressed over restart
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  //telling trx to collide invisible ground
  trex.collide(invisibleGround);
  drawSprites();
  }

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -5;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 2*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  
  //tellin to play again
  gameState = PLAY;
  
  //turning gameover and restart visible false
  gameOver.visible = false;
  restart.visible = false;
  
  //telling obstaclesGroup and cloudsGroup to destroy
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  //giving ground velocity 
  ground.velocityX = -4;
  
  //changing trex's animation back
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}