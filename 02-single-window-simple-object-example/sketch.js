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


// apply easeOutBack dynamics 
const stiffness = 0.6;      // how strong the spring pulls
const damping = 0.8;        // how much the movement is slowed
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
  noStroke();

  follower = createVector(width / 2, height / 2);
  velocity = createVector(0, 0);
}




function draw() {
  background(0, 0,0, drawingParams.backgroundAlpha);

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

  // const distance = p5.Vector.dist(follower, target);
  // ellipse(follower.x, follower.y, distance + 20, distance + 20);

  ellipse(follower.x, follower.y, 20, 20);

}




