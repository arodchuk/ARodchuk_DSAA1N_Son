let fft;
let gridSize = 25;

let squareMap = [];
let squareCount = 12;

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
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT(0.8, 1024);
  noFill();
  rectMode(CENTER);
  noCursor();

  for (let i = 0; i < squareCount * squareCount; i++) {
  squareMap[i] = floor(random(0, 512));
}

}

function mousePressed() {
  if (!started) {
    userStartAudio();
    started = true;
    playTrack(currentIndex);
  }
}

function draw() {
  background("#0B0033"); 

  let spectrum = fft.analyze();

  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  //grille néon
  drawNeonGrid(bass*0.9);

  //carrés glitch pulsants
  drawPulsingSquares(spectrum);
}

// function drawNeonGrid(bass) {
//   stroke("#00FFFF");
//   strokeWeight(0.7);

//   let offset = map(bass, 0, 255, 0, 10);

//   for (let x = -offset; x < width + offset; x += gridSize) {
//     for (let y = -offset; y < height + offset; y += gridSize) {
//       push();
//       translate(x, y);
//       let n = noise(x * 0.01 + frameCount * 0.03, y * 0.01) * gridSize * 8;
//       rect(0, 0, n, n);
//       pop();
//       noFill();
//       //fill("#0B0033")
//     }
//   }
// }

function playTrack(idx) {
  for (let s of sounds) {
    if (s && s.isPlaying()) s.stop();
  }
  currentIndex = idx;
  sounds[currentIndex].loop();
}

function drawNeonGrid(bass) {
  push();

  rectMode(CENTER);
  noFill();
  stroke("#00FFFF");
  strokeWeight(0.7);

  // contrôle souris (haut → petit / bas → grand)
  let mouseFactor = map(mouseY, 0, height, 0.3, 2.2);
  mouseFactor = constrain(mouseFactor, 0.3, 2.2);

  // léger effet basses
  let bassFactor = map(bass, 0, 255, 0.8, 1.4);

  let offset = map(bass, 0, 255, 0, 10);

  for (let x = -offset; x < width + offset; x += gridSize) {
    for (let y = -offset; y < height + offset; y += gridSize) {

      let n = noise(
        x * 0.01 + frameCount * 0.03,
        y * 0.01
      );

      // taille finale du carré
      let s = map(n, 0.002, 0.15, 40, gridSize);
      s *= mouseFactor * bassFactor;

      push();
      translate(x, y);
      rect(0, 0, s, s);
      pop();
    }
  }

  pop();
}



function drawPulsingSquares(spectrum) {
  push();

  let w = width / squareCount;
  let h = height / squareCount;

  rectMode(CENTER);
  noStroke();

  let index = 0;

  for (let i = 0; i < squareCount; i++) {
    for (let j = 0; j < squareCount; j++) {

      let idx = squareMap[index];
      let s = spectrum[idx];

      let size = map(s, 0, 255, 4, w * 0.5);

      let c = colors[(i + j) % colors.length];
      fill(c);

      rect(
        i * w + w / 2,
        j * h + h / 2,
        size,
        size
      );

      index++;
    }
  }

  pop();
}


function keyPressed() {
  if (key >= "1" && key <= "5") {
    playTrack(int(key) - 1);
  }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
