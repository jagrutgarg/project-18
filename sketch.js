var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score = 0;
var jumpSound, collidedSound;
var gameOver, restart;


function preload(){
  backgroundImg = loadImage("sprites/backgroundImg.png")
  sunAnimation = loadImage("sprites/sun.png");
  
  trex_running = loadAnimation("sprites/1110.png","sprites/2110.png","sprites/3110.png","sprites/4110.png","sprites/5110.png",
  "sprites/6110.png","sprites/7110.png","sprites/8110.png","sprites/9110.png","sprites/10110.png","sprites/11110.png","sprites/12110.png",
  "sprites/13110.png","sprites/14110.png","sprites/15110.png","sprites/16110.png","sprites/17110.png","sprites/18110.png","sprites/19110.png",
  "sprites/20110.png","sprites/21110.png","sprites/22110.png","sprites/23110.png","sprites/24110.png","sprites/25110.png","sprites/26110.png",
  "sprites/27110.png","sprites/28110.png","sprites/29110.png");
  trex_collided = loadAnimation("sprites/1110.png");
  
  groundImage = loadImage("sprites/ground.png");
  
  cloudImage = loadImage("sprites/cloud.png");
  
  obstacle1 = loadImage("sprites/obstacle1.png");
  obstacle2 = loadImage("sprites/obstacle2.png");
  obstacle3 = loadImage("sprites/obstacle3.png");
  obstacle4 = loadImage("sprites/obstacle4.png");
  
  gameOverImg = loadImage("sprites/gameOver.png");
  restartImg = loadImage("sprites/restart.png");
  jumpButtonImage = loadImage("sprites/jump_button.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight-110);
  
  sun = createSprite(width/1.1,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.17;
  
  trex = createSprite(120,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',100,0,110)
  trex.scale = 0.45;
  //trex.debug=true;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(displayWidth/4.5, height - 30, width, 2);
  ground.addImage("ground",groundImage);
  ground.width = displayWidth;
  ground.velocityX = -(6 + 3*score/100);
  ground1 = createSprite(displayWidth/4.5, height - 30, width, 2);
  ground1.addImage("ground",groundImage);
  ground1.width = displayWidth;
  ground1.x = ground.x + 600;
  ground1.velocityX = -(6 + 3*score/100);
  ground2 = createSprite(displayWidth/4.5, height - 30, width, 2);
  ground2.addImage("ground",groundImage);
  ground2.width = displayWidth;
  ground2.x = ground1.x + 600;
  ground2.velocityX = -(6 + 3*score/100);
  ground3 = createSprite(displayWidth/4.5, height - 30, width, 2);
  ground3.addImage("ground",groundImage);
  ground3.width = displayWidth;
  ground3.x = ground2.x + 600;
  ground3.velocityX = -(6 + 3*score/100);
  jumpButton = createSprite(displayWidth/1.1, height/1.2);
  jumpButton.addImage("jump_button", jumpButtonImage);
  jumpButton.scale = 0.3;
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  sun = createSprite(width/1.1,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.17;
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    ground1.velocityX = -(6 + 3*score/100);
    ground2.velocityX = -(6 + 3*score/100);
    ground3.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-200 || mousePressedOver(jumpButton) && trex.y  >= height-200){
      trex.velocityY = -15;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/4.5;
      ground1.x = ground.x + 600;
      ground2.x = ground1.x + 600;
      ground3.x = ground2.x + 600;
    }
    
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    ground1.velocityX = 0;
    ground2.velocityX = 0;
    ground3.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
     if(mousePressedOver(restart)) {
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 110 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 1000;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(displayWidth/1.5 ,height-95, 20, 30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
    obstacle.velocityX = -(6 + 3*score/100);
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;              
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}