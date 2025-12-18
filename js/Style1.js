let grille = 20;
let marge = 0;
let amp;
let fft;

let offsetX = 0;
let offsetY = 0;

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
  colorMode(HSL);
  angleMode(DEGREES);
  rectMode(CENTER);
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(10);
  amp = new p5.Amplitude();
  fft = new p5.FFT();
}

let zoom = 0.009;
let temps = 0;

function draw() {
  translate(-width / 2, -height / 2);

  fft.analyze();
  grille2();
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

function grille2() {
  background("#0B0033");

  let level = amp.getLevel();
  let bass = fft.getEnergy("bass");
  temps = temps + level * 0.5;

  // facteurs taille contrôlés par la souris
  let facteurW = map(mouseX, 0, width, 0.2, 3);
  let facteurH = map(mouseY, 0, height, 0.2, 3);
  facteurW = constrain(facteurW, 0.2, 2.5);
  facteurH = constrain(facteurH, 0.2, 2.5);

  for (let x = marge; x < width - marge; x += grille) {
    for (let y = marge; y < height - marge; y += grille) {
      let paramX = (x + offsetX) * zoom / 50;
      let paramY = (y + offsetY) * zoom / 50;

      let noise3d = noise(paramX, paramY, temps) * 360;
      let treshold = noise(paramX, paramY, temps);

      let currentFill;
      if (treshold > 0.6) currentFill = "#FF2BC2";
      else if (treshold > 0.4) currentFill = "#7A00FF";
      else if (treshold > 0.3) currentFill = "#0CECF8";
      else currentFill = "#F2FF00";

      push();
      fill(currentFill);
      noStroke();
      translate(x, y);
      rotateY(noise3d * 0.05);
      rotateX(noise3d * 50);

      // largeur/hauteur changent avec mouseX/mouseY, depuis le centre
      rect(0, 0, (grille - 5) * facteurW, (grille - 5) * facteurH);

      pop();
    }
  }
}

function mouseWheel(event) {
  zoom += event.delta * -0.00001;
  zoom = constrain(zoom, 0.001, 500);
  return false;
}

function mouseDragged() {
  offsetX = -mouseX;
  offsetY = -mouseY;
}
