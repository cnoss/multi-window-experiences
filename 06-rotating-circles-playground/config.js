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
  backgroundAlpha: 6,
  backgroundAlphaMin: 0,
  backgroundAlphaMax: 100,
  foregroundAlpha: 50,
  colorHue: 200,
  colorHueMax: 360,
  steps: 80,
  stepsMin: 1,
  innerRadius1: 100,
  innerRadius1Max: 500,
  innerRadius2: 140,
  innerRadius2Max: 500,
  outerRadius1: 380,
  outerRadius1Max: 500,
  outerRadius2: 400,
  outerRadius2Max: 500,
  rotate: [true,false],
  vitality: 20,
};

// Params for logging
const loggingParams = {
  targetDrawingParams: document.getElementById('drawingParams'),
  targetCanvasParams: document.getElementById('canvasParams'),
  state: false
};


/* ###########################################################################
Service Functions
############################################################################ */



function getCanvasHolderSize() {
  canvasParams.w = window.screen.width;
  canvasParams.h = window.screen.height
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

/* Create Window ID
############################################################################ */

function getWindowId(){
  const now = new Date();
  const windowId = String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');

  return "window-" + windowId;
};
