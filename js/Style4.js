let fft, amp;


let blocks = [];
let hatchGfx;


let lastBeatTime = 0;
let beatHoldMs = 120;     // temps mini entre 2 beats
let beatThreshold = 0.18; // seuil amplitude (à ajuster selon la musique)
let decay = 0.92;         // lissage pour la détection
let smoothed = 0;


const bgColor = "#12002a"; // violet très sombre

let sounds = [];
let currentIndex = 0;
let started = false;

const palette = [
  "#FFD100", // jaune
  "#FF2BD6", // rose/magenta
  "#7B1CFF", // violet
  "#19E6FF"  // cyan
];


function preload() {
  sounds[0] = loadSound("sound/Jaunter - Time Capsule - 01 Paradox.mp3");
  sounds[1] = loadSound("sound/Jaunter - Time Capsule - 02 Stasis.mp3");
  sounds[2] = loadSound("sound/Jaunter - Time Capsule - 03 Vortex.mp3");
  sounds[3] = loadSound("sound/Jaunter - Time Capsule - 04 Multiverse.mp3");
  sounds[4] = loadSound("sound/Jaunter - Time Capsule - 05 Reset.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);


  fft = new p5.FFT(0.9, 1024);
  amp = new p5.Amplitude(0.9);


  // texture de hachures diagonales (pré-calculée)
  hatchGfx = createGraphics(width, height);
  makeHatches(hatchGfx);




}


function draw() {
  background(bgColor);


  // Fond hachuré
  image(hatchGfx, 0, 0);


  // Analyse audio
  let level = amp.getLevel();
  smoothed = max(level, smoothed * decay);


  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");      // 0..255
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");


  // Détection beat
  let now = millis();
  let isBeat = (smoothed > beatThreshold) && (now - lastBeatTime > beatHoldMs);


  if (isBeat) {
    lastBeatTime = now;


    // Sur beat, spawn 2–4 blocks
    let n = floor(random(2, 5));
    for (let i = 0; i < n; i++) {
      // Choix de l'orientation
      let orient = (bass > mid) ? random(["v", "v", "h"]) : random(["h", "v"]);
      let col = pickColorByEnergy(bass, mid, treble);
      let w = map(bass, 0, 255, 0.25, 2, true);
      spawnBlock(orient, col, w);
    }
  }


  // Mise à jour + rendu des blocks
  for (let i = blocks.length - 1; i >= 0; i--) {
    blocks[i].update(level, bass, mid, treble);
    blocks[i].draw();
    if (blocks[i].dead()) blocks.splice(i, 1);
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
  if (key === " ") togglePlay();
  if (key >= "1" && key <= "5") {
    playTrack(int(key) - 1);
  }
}



function togglePlay() {
  if (!song.isPlaying()) {
    userStartAudio();
    song.loop();
  } else {
    song.pause();
  }
}


function makeHatches(g) {
  g.clear();
  g.noFill();
  g.stroke(170, 110, 255, 35); // violet clair transparent
  g.strokeWeight(2);


  // lignes diagonales
  let step = 22;
  for (let x = -height; x < width + height; x += step) {
    g.line(x, 0, x + height, height);
  }
}


// Spawn d'une "barre" (horizontale/verticale) style néon
function spawnBlock(orient, col, weightNorm) {
  // poids du trait (épaisseur)
  let thick = lerp(6, 22, weightNorm);


  // longueur dominante
  let long = random() < 0.75;


  let len = long ? random(width * 0.35, width * 0.95) : random(width * 0.12, width * 0.35);


  // position
  let x1, y1, x2, y2;


  if (orient === "h") {
    y1 = y2 = random(height);
    x1 = random(-width * 0.1, width * 0.8);
    x2 = x1 + len;
  } else {
    x1 = x2 = random(width);
    y1 = random(-height * 0.1, height * 0.8);
    y2 = y1 + len;
  }


  blocks.push(new NeonSegment(x1, y1, x2, y2, col, thick));
}


// Couleur pilotée par énergie
function pickColorByEnergy(bass, mid, treble) {
  // bass -> jaune, mid -> violet/rose, treble -> cyan
  let r = random();
  if (bass > 160 && r < 0.55) return "#FFD100";
  if (treble > 130 && r < 0.55) return "#19E6FF";
  if (mid > 150 && r < 0.6) return random(["#FF2BD6", "#7B1CFF"]);
  return random(palette);
}




   //Classe NeonSegment
class NeonSegment {
  constructor(x1, y1, x2, y2, col, thick) {
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
    this.col = color(col);
    this.baseThick = thick;


    this.life = 1;        // 1 -> 0
    this.fadeSpeed = random(0.004, 0.012);
    this.pulse = 10;         // pulsation sur audio
  }


  update(level, bass, mid, treble) {
    // Déclin
    this.life -= this.fadeSpeed;


    // Pulsation : plus il y a de niveau, plus ça “gonfle”
    this.pulse = lerp(this.pulse, map(level, 0, 0.35, 0, 1.0, true), 1.4);


    // Micro variation sur la fin pour éviter statique
    if (this.life < 0.35) this.fadeSpeed *= 1.01;
  }


  draw() {
    if (this.life <= 0) return;


    // Alpha
    let a = 255 * constrain(this.life, 0, 1);


    // épaisseur audio-réactive
    let thick = this.baseThick * (1 + 0.7 * this.pulse);


    // Glow (3 passes)
    strokeCap(SQUARE);


    // halo large
    stroke(red(this.col), green(this.col), blue(this.col), a * 0.22);
    strokeWeight(thick * 2.6);
    line(this.x1, this.y1, this.x2, this.y2);


    // halo moyen
    stroke(red(this.col), green(this.col), blue(this.col), a * 0.35);
    strokeWeight(thick * 1.6);
    line(this.x1, this.y1, this.x2, this.y2);


    // coeur net
    stroke(red(this.col), green(this.col), blue(this.col), a * 10);
    strokeWeight(thick);
    line(this.x1, this.y1, this.x2, this.y2);
  }


  dead() {
    return this.life <= 0;
  }
}
