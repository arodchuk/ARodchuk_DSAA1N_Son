let zoom = 0.0009;
let amp;




let time =0;
let img;
let ecart = 190

let sounds = [];
let currentIndex = 0;
let started = false;




function preload() {
  sounds[0] = loadSound("sound/Jaunter - Time Capsule - 01 Paradox.mp3");
  sounds[1] = loadSound("sound/Jaunter - Time Capsule - 02 Stasis.mp3");
  sounds[2] = loadSound("sound/Jaunter - Time Capsule - 03 Vortex.mp3");
  sounds[3] = loadSound("sound/Jaunter - Time Capsule - 04 Multiverse.mp3");
  sounds[4] = loadSound("sound/Jaunter - Time Capsule - 05 Reset.mp3");
}






function setup() {
   
    angleMode(DEGREES)
 createCanvas(windowWidth, windowHeight);
 //background(0,225,0)
    colorMode(HSL)
    amp = new p5.Amplitude();
    textAlign(CENTER)
    ellipseMode(CENTER)
    rectMode(CENTER)
}




let grille = 20;
let marge =1
let maxRota=360




let margeGrille =0;
let grille3Play = true;




function draw() {
    let boucle = frameCount%1030;
   
background("#0B0033")  
grille1()
}


function playTrack(idx) {
  for (let s of sounds) {
    if (s && s.isPlaying()) s.stop();
  }
  currentIndex = idx;
  sounds[currentIndex].loop();
}

function keyPressed() {
  if (key >= "1" && key <= "5") {
    playTrack(int(key) - 1);
  }
}




function mousePressed() {
  if (!started) {
    userStartAudio();
    started = true;
    playTrack(currentIndex);
  }
}






function grille3(){
     let level = amp.getLevel();
   //time = time+level;
   time+=level*0.3;
   //console.log(level)
  background("#7A00FF")
   noStroke()
   
 
   
 for (let x = 0; x <width; x+=grille) {
   
    for (let y = 0; y <height; y+=grille) {
     
 
     
  //let noiseX = noise(x*y+time)*200
      let s = noise(x*zoom,y*zoom,time)
      let s1 = noise(500+x*zoom,500+y*zoom,time)
      let noiseX = map(s,0,1,-100,100)
      let noiseY = map(s1,0,1,-100,100)
     fill(251, 100, 22.9)
      noStroke()




      push()
      translate(noiseX+ x+grille/2,noiseY+y+grille/2)
      textSize(grille)
      //strokeWeight(5)
     text('x',0,0)
     pop()
   
   
 
 }
 }
}






function grille1(){
      let level = amp.getLevel();
      time+=level*0.105;




      stroke ("#00FFFF")
      //fill ('#58ff6eff')
      noFill()




 for (let x =-10000; x <width; x+=grille*0.5) {
  beginShape()
    for (let y = 0; y <height; y+=grille) {
     
      let noiseX = noise(x*zoom,y*zoom,time)*100




      vertex(x+noiseX*55,y*noiseX/20)
    }
  endShape()
  }
}






