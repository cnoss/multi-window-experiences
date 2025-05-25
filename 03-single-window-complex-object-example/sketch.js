/* ############################################################################ 
Kurs «Generative Gestaltung» an der TH Köln
Christian Noss
christian.noss@th-koeln.de
https://twitter.com/cnoss
https://cnoss.github.io/generative-gestaltung/

############################################################################ */

let canvas;
let follower;
let velocity;

const innerRadius1 = 40;
const innerRadius2 = 40;
const outerRadius1 = 120;
const outerRadius2 = 120;

// apply easeOutBack dynamics 
const stiffness = 0.6;      // how strong the spring pulls
const damping = 0.1;        // how much the movement is slowed
const backforce = 0.9;      // "overshoot" factor (more = stronger bounce)

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
  stroke(200)

  follower = createVector(width / 2, height / 2);
  velocity = createVector(0, 0);
}



function draw() {
  background(0, 0,0, drawingParams.backgroundAlpha);

  randomSeed(0);

  const targetX = window.screenX + window.innerWidth / 2;
  const targetY = window.screenY + window.innerHeight / 2;
  const target = createVector(targetX, targetY);
  const dir = p5.Vector.sub(target, follower);

  // Move the origin of the canvas to the top left corner of the screen
  // This is necessary to make the follower move towards the center of the screen
  const originX = -window.screenX;
  const originY = -window.screenY;
  translate(originX, originY);

  // artificial backforce: we scale the pull vector slightly beyond the target
  dir.mult(backforce);

  // acceleration = pull force
  const acceleration = dir.mult(stiffness);

  // velocity += acceleration, then apply damping
  velocity.add(acceleration);
  velocity.mult(damping);

  // move follower
  follower.add(velocity);

  const segments = 360 / drawingParams.steps;

  translate(follower.x, follower.y);
  const distance = p5.Vector.dist(follower, target);

  const skew = map(distance, 0, width/2, 0, 360);

  for (let angle = 0; angle < 360; angle += segments) {

    strokeWeight(1);

    const randomX1 = random(-distance, distance);
    const randomY1 = random(-distance, distance);
    const x1 = cos(angle + skew) * innerRadius1 
    const y1 = sin(angle + skew) * innerRadius2;
    const x2 = cos(angle) * (outerRadius1); //+ randomX1;
    const y2 = sin(angle) * (outerRadius2); //  + randomY1;
    line(x1, y1, x2, y2);
  }

}




