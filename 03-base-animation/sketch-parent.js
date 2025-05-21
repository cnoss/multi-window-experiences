// import { drawFunkyObject } from "./shared.js";

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
window.drawingParams = {
  steps: 40,
  stepsMin: 1,
  stepsMax: 720,
  stepsStep: 10,
  sat: 20,
  bri: 100,
  alpha: 90,
  hue: 0,
  hueMax: 360,

  innerCircleRadius: 50,
  innerCircleRadiusMin: -100,
  innerCircleRatio: 1,
  innerCircleRatioMax: 5,
  innerCircleRatioStep: 0.1,
  innerCircleMultiplier: 1,
  innerCircleMultiplierMax: 5,
  innerCircleRatioMin: 0.1,

  outerCircleRadius: 100,
  outerCircleRadiusMin: -100,
  outerCircleRatio: 1,
  outerCircleRatioMax: 5,
  outerCircleRatioStep: 0.1,
  outerCircleMultiplier: 1,
  outerCircleMultiplierMax: 5,
  outerCircleRatioMin: 0.1,

  bgalpha: 10,
  randomDeviation: 0,
  randomMean: 0,

  exitement: 20,
};

// Params for logging
const loggingParams = {
  targetDrawingParams: document.getElementById('drawingParams'),
  targetCanvasParams: document.getElementById('canvasParams'),
  state: false
};


window.windowCollection = [];
const childWindowPrefix = "childWindow-";




/* ###########################################################################
Classes
############################################################################ */



class Window{
  constructor(id, role, width, height){
    this.id = id;
    this.role = role;
    this.width = width;
    this.height = height;
    this.x = width;
    this.y = 0;
    this.trackPosition();
    this.window = window;
  }

  open(){
    const url = `./kind.html?title=${this.id}`;
    this.window = window.open(url, this.id, `width=${this.width}, height=${this.height}`);
    this.window.name = this.id;
    this.window.title = this.id;
    this.window.moveTo(this.x, this.y);
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
    setInterval(() => this.checkPosition(), 100);
    
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



function manageRootWindow() {
  if (window.name === "Root") {
    // const rootWindow = new Window(window.name, "parent", window.innerWidth, window.innerHeight);
    // windows.push(rootWindow);

  };
};



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

  // drawingParams.innerRadius1Max = height * 0.5;
  // drawingParams.outerRadius1Max = height * 0.5;
  // drawingParams.innerRadius2Max = height * 0.5;
  // drawingParams.outerRadius2Max = height * 0.5;
// 
  // drawingParams.innerRadius1Min = height * -0.5;
  // drawingParams.outerRadius1Min = height * -0.5;
  // drawingParams.innerRadius2Min = height * -0.5;
  // drawingParams.outerRadius2Min = height * -0.5;

  
    const rootWindow = new Window(window.name, "parent", window.innerWidth, window.innerHeight);
    windowCollection.push(rootWindow);
    
    let navHelper = new helperNavElements();
    navHelper.init();
  


  // Display & Render Options
  // frameRate(60);
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
  
  // ellipseMode(CORNER);

  manageRootWindow();

}

const bc = new BroadcastChannel("test_channel");

bc.onmessage = (event) => {
  console.log(event);
};

window.addEventListener('message', (e) => {
  if (e.data.type === 'call' && e.data.method === 'sayHello') {
    console.log(...e.data.args);
  }
});



function draw() {



  /* ----------------------------------------------------------------------- */
  // Log globals
  if (!canvasParams.mouseLock) {
    canvasParams.mouseX = mouseX;
    canvasParams.mouseY = mouseY;
    logInfo();
  }

  /* ----------------------------------------------------------------------- */
  // Provide your Code below


  drawFunkyObject();
// drawForm();

}

function keyPressed() {

  if (keyCode === 81) { // Q-Key
    console.log(windowCollection);
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

