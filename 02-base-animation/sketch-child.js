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





/* ###########################################################################
Classes
############################################################################ */


/* ###########################################################################
Custom Functions
############################################################################ */



function drawPunkt() {

  const dot = window.opener.dots[0];
const Dot = window.opener.AutonomDot;
Object.setPrototypeOf(dot, Dot.prototype);
console.log(typeof dot.show); // sollte function sein
dot.show(); // sollte zeichnen + loggen
  window.opener.dots.forEach(dot => {

    const Dot = window.opener.AutonomDot;

    if (dot && Dot) {
      Object.setPrototypeOf(dot, Dot.prototype);

      dot.show(); // ✅ Jetzt sollte es klappen!
      // console.log(typeof dot.show);
    } else {
      console.warn('Katze oder Klasse nicht verfügbar');
    }

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

  // noLoop();
}



function draw() {


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

