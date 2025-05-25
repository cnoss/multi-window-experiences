/* ############################################################################ 
Kurs «Generative Gestaltung» an der TH Köln
Christian Noss
christian.noss@th-koeln.de
https://twitter.com/cnoss
https://cnoss.github.io/generative-gestaltung/

############################################################################ */

let canvas;

/* ###########################################################################
Classes
############################################################################ */


/* ###########################################################################
Custom Functions
############################################################################ */



/* ###########################################################################
P5 Functions
############################################################################ */

function setup() {

  if (canvasParams.mode === 'SVG') {
    canvas = createCanvas(canvasParams.w, canvasParams.h, SVG);
  } else {
    canvas = createCanvas(canvasParams.w, canvasParams.h);
    canvas.parent("canvas");
  }

  // Display & Render Options
  // frameRate(1);
  angleMode(DEGREES);
  smooth();

  // GUI Management
  if (canvasParams.gui) {
    const sketchGUI = createGui('Params');
    sketchGUI.addObject(drawingParams);
  }

  // Anything else
  colorMode(HSB, 360, 100, 100, 100);
  fill(200);
  noStroke();

  follower = createVector(width / 2, height / 2);
  velocity = createVector(0, 0);
}


let posX, posY;

function draw() {
  background(0, 0, 0, 100);

  if (drawingParams.context === 'screen') {
    // Move the origin of the canvas to the top left corner of the screen
    const originX = -window.screenX;
    const originY = -window.screenY;
    canvas.width = screen.width;
    canvas.height = screen.height;
    translate(originX, originY);
    posX = width / 2;
    posY = height / 2;

  }else{
    posX = window.innerWidth / 2;
    posY = window.innerHeight / 2;
  }

  ellipse(posX, posY, 60, 60);

}




