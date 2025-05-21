/*jshint esversion: 6 */

/* ############################################################################ 

Kurs «Generative Gestaltung» an der TH Köln
Christian Noss
christian.noss@th-koeln.de
https://twitter.com/cnoss
https://cnoss.github.io/generative-gestaltung/

############################################################################ */

const saveParams = {
  sketchName: "A2"
}



// Params for canvas
const canvasParams = {
  holder: document.getElementById('canvas'),
  state: false,
  mouseX: false,
  mouseY: false,
  mouseLock: false,
  background: 0,
  gui: true,
  mode: 'canvas', // canvas or svg … SVG mode is experimental 
};
getCanvasHolderSize();

// Params for the drawing
const drawingParams = {
  crosshairs: [true, false],
  backgroundAlpha: 90,
  backgroundAlphaMin: 0,
  backgroundAlphaMax: 100,
};

// Params for logging
const loggingParams = {
  targetDrawingParams: document.getElementById('drawingParams'),
  targetCanvasParams: document.getElementById('canvasParams'),
  state: false
};


const dots = [];
const windows = [];
const virtualCanvas = {};



/* ###########################################################################
Classes
############################################################################ */

class AutonomDot{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.speedX = random(1, 10);
    this.speedY = random(1 , 10);
    this.directionX = random(-1, 1);
    this.directionY = random(-1, 1);
  }

  move(){

    getAccumulatedCanvasSize();

    this.x += this.speedX * this.directionX;
    this.y += this.speedY * this.directionY;
    this.directionX = this.x > virtualCanvas.width || this.x < 0 ? this.directionX * -1 : this.directionX;
    this.directionY = this.y > virtualCanvas.height || this.y < 0 ? this.directionY * -1 : this.directionY;
  }

  show(){
    this.move();
    stroke(255);
    strokeWeight(1);
    ellipse(this.x, this.y, 10, 10);
  }
}

class Window{
  constructor(id, role, width, height){
    this.id = id;
    this.role = role;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.trackPosition();
    this.window = window;
  }

  open(){

    const url = `./kind.html?title=${this.id}`;
    this.window = window.open(url, this.id, `width=${this.width}, height=${this.height}`);
    this.window.name = this.id;
    this.window.title = this.id;
  };

  checkPosition(){

    if(this.window.closed) return;

    const currentX = this.window.screenX;
    const currentY = this.window.screenY;

    if (currentX !== this.x){ this.x = currentX; }
    if (currentY !== this.y){ this.y = currentY; }
      // window.opener?.postMessage({
    //   type: 'position',
    //   from: slug,
    //   coords: { x: currentX, y: currentY }
    // }, '*');

    // console.log(`Window ${this.id} position: (${this.x}, ${this.y})`);
    // console.log(this);

  }


  trackPosition(){
    setInterval(() => this.checkPosition(), 1000);
    
  }
  
}

/* ###########################################################################
Custom Functions
############################################################################ */

function getAccumulatedCanvasSize() {

  const minX = Math.min(...windows.map(w => w.x));
  const minY = Math.min(...windows.map(w => w.y));
  const maxX = Math.max(...windows.map(w => w.x + w.width));
  const maxY = Math.max(...windows.map(w => w.y + w.height));

  virtualCanvas.x = minX;
  virtualCanvas.y = minY;
  virtualCanvas.width = maxX - minX;
  virtualCanvas.height = maxY - minY;

  return virtualCanvas;
}

function drawPunkt(dots){
  console.log(dots);
    dots.forEach(dot => {
    dot.show();
  });
}



/* ###########################################################################
P5 Functions
############################################################################ */

function setup() {

  let canvas;
  if (canvasParams.mode === 'SVG') {
    canvas = createCanvas(canvasParams.w, canvasParams.h, SVG);
  } else { 
    canvas = createCanvas(canvasParams.w, canvasParams.h);
    canvas.parent("canvas");
  }

  /* Window Management
  ----------------------------------------------------------------------- */
  if(!window.name){
    window.name = "Root";
  }

  if (window.name === "Root") {
    const rootWindow = new Window(window.name, "parent", window.innerWidth, window.innerHeight);
    windows.push(rootWindow);
    
    let navHelper = new helperNavElements();
    navHelper.init();
  }


  // Display & Render Options
  frameRate(1);
  angleMode(DEGREES);
  smooth();

  // GUI Management
  if (canvasParams.gui && window.name === "Root") { 
    const sketchGUI = createGui('Params');
    sketchGUI.addObject(drawingParams);
  }

  // Anything else
  colorMode(HSB, 360, 100, 100, 100);
  fill(200);
  // stroke(0);
  noStroke();
  background(0,100,100);
  // ellipseMode(CORNER);

  dots.push(new AutonomDot(100, 100));
}



function draw() {

  //noLoop();

  
  

  if (window.name === "Root") {
    const childWindows = windows.filter(w => w.role === "child");
    childWindows.forEach(w => {
      w.window.drawPunkt(dots);
    });
  }



  /* ----------------------------------------------------------------------- */
  // Log globals
  if (!canvasParams.mouseLock) {
    canvasParams.mouseX = mouseX;
    canvasParams.mouseY = mouseY;
    logInfo();
  }

  /* ----------------------------------------------------------------------- */
  // Provide your Code below
  //background(0,0,0, drawingParams.backgroundAlpha);

  dots.forEach(dot => {
    dot.show();
  });

}

function keyPressed() {

  if (keyCode === 81) { // Q-Key
    getAccumulatedCanvasSize();
  }

  if (keyCode === 87) { // W-Key
    console.log("W-Key pressed");
  }

  if (keyCode === 89) { // Y-Key
  }

  if (keyCode === 88) { // X-Key
  }

  if (keyCode === 83) { // S-Key
    const suffix = (canvasParams.mode === "canvas") ? '.jpg' : '.svg';
    const fragments = location.href.split(/\//).reverse();
    const suggestion = fragments[1] ? fragments[1] : 'gg-sketch';
    const fn = prompt(`Filename for ${suffix}`, suggestion);
    save(fn + suffix);
  }

  if (keyCode === 49) { // 1-Key
  }

  if (keyCode === 50) { // 2-Key
  }

  if (keyCode === 76) { // L-Key
    if (!canvasParams.mouseLock) {
      canvasParams.mouseLock = true;
    } else { 
      canvasParams.mouseLock = false;
    }
    document.getElementById("canvas").classList.toggle("mouseLockActive");
  }


}



function mousePressed() {}



function mouseReleased() {
  dots.push(new AutonomDot(mouseX, mouseY));
}



function mouseDragged() {}



function keyReleased() {
  if (keyCode == DELETE || keyCode == BACKSPACE) clear();
}





/* ###########################################################################
Service Functions
############################################################################ */



function getCanvasHolderSize() {
  canvasParams.w = canvasParams.holder.clientWidth;
  canvasParams.h = canvasParams.holder.clientHeight;
}



function resizeMyCanvas() {
  getCanvasHolderSize();
  resizeCanvas(canvasParams.w, canvasParams.h);
}



function windowResized() {
  resizeMyCanvas();
}



function logInfo(content) {

  if (loggingParams.targetDrawingParams) {
    loggingParams.targetDrawingParams.innerHTML = helperPrettifyLogs(drawingParams);
  }

  if (loggingParams.targetCanvasParams) {
    loggingParams.targetCanvasParams.innerHTML = helperPrettifyLogs(canvasParams);
  }

}

