let grille = 8.5;
let amp;
let font;
  "#0B0033"
  "#FF2BC2", 
  "#00FFFF", 
  "#7A00FF", 
  "#FFD300" 

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


let marge = 0;
//let zoom = 0.005; //on peut le basculer vers draw


function setup() {
    colorMode(HSL);
    createCanvas(windowWidth, windowHeight);
    noCursor();


    background("#0B0033")
    //fill(0);
    frameRate(10);




    amp = new p5.Amplitude(); // pour que la variable amp recupere l'aplitude du son (amp du son = puissance du son)


}


let zoom = 0.009;
let temps = 0;


function draw() {


    let level = amp.getLevel(); //on traduit l'amplitude en chiffres
    temps = temps+level;


    background ("#0B0033");
    fill(0);
    noStroke();
    //let zoom = mouseX*0.001;
    for(let x = marge; x<width-marge; x+=grille) {
        for(let y = marge; y<height-marge; y+=grille) {
     

           
            let seed = y*x;  //c'est en multipliant x par y dans la seed parce que ca va permettre que les cercles proches n'aient pas la même valeur
            //let s = noise(seed+frameCount*0.25)*grille*2;
       
            let paramX=x*zoom;
            let paramY=y*zoom;


            let temps = level*1.5; //à varier la valeur qu'on multiplie par level


            let noise2d = noise(paramX,paramY,temps)*grille*5;  //si level à la place du temps, ca bouge en fonction de l'amp
            let bruitX = noise(paramX,paramY,temps)*100;
            let treshold = noise(paramX,paramY,temps);
            //ellipse(x,y,noise2d);
            // square(x,y,noise2d);
            

            
  
            //line(x,y,x+bruitX,y+grille)
           
                  if (treshold > 0.58) {

                    push();
                    fill("#FF2BC2");
                    stroke("#7A00FF");
                    ellipse(x, y, grille);
                    pop();

                  } else if (treshold > 0.4) {

                    push();
                    fill("#0B0033");
                    stroke("#7A00FF");
                    square(x, y, grille);
                    pop();

                  } else if (treshold > 0.3) {

                    push();
                    fill("#0cecf8ff");
                    stroke("#7A00FF");
                    square(x, y, grille);
                    pop();

                  } else {

                    push();
                    fill("#f2ff00ff");
                    //stroke("#7A00FF");
                    ellipse(x, y, grille);
                    pop();
                  }
        }
    }
 
}


function playTrack(idx) {
  for (let s of sounds) {
    if (s && s.isPlaying()) s.stop();
  }
  currentIndex = idx;
  sounds[currentIndex].loop();
}

function mousePressed() {
  if (!started) {
    userStartAudio();
    started = true;
    playTrack(currentIndex);
  }
}

function keyPressed() {
  if (key >= "1" && key <= "5") {
    playTrack(int(key) - 1);
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
