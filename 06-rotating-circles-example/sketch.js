/* ############################################################################ 
Kurs «Generative Gestaltung» an der TH Köln
Christian Noss
christian.noss@th-koeln.de
https://twitter.com/cnoss
https://cnoss.github.io/generative-gestaltung/

############################################################################ */

let skew = 0;
let timeForNoise = 0;
let skewAdd = 0;

/* ###########################################################################
Classes
############################################################################ */


/* ###########################################################################
Custom Functions
############################################################################ */



// Move the origin of the canvas to the top left corner of the screen
function moveOriginOfCanvaa(){
  const originX = -window.screenX;
  const originY = -window.screenY;
  translate(originX, originY);
}


const worker = new SharedWorker('multiple-window-data-shared-worker.js', { name: 'multiple-window-shared-worker' });
worker.port.start();

const myId = window.name || getWindowId();
window.name = myId;

// Store current metrics (position, size, center)
const myWindowMetrics = {
  x: false,
  y: false,
  width: false,
  height: false,
  centerX: false,
  centerY: false
};

const otherWindowMetrics = {
  x: false,
  y: false,
  width: false,
  height: false,
  centerX: false,
  centerY: false
};

const updateMetricsInUI = (selector, metrics) => {
  const target = document.querySelector(`[${selector}]`);
  target.innerHTML = `
	        <dl>
	          <dt>Position</dt>
	          <dd>${metrics.x}, ${metrics.y}</dd>
	          <dt>Size</dt>
	          <dd>${metrics.width}×${metrics.height}</dd>
	          <dt>Center</dt>
	          <dd>${metrics.centerX}, ${metrics.centerY}</dd>
	        </dl>
	      `;

  target.classList.remove('has-been-changed');
  void target.offsetWidth; // force reflow
  target.classList.add('has-been-changed');
};

const calculateMetrics = () => {
  const x = window.screenX;
  const y = window.screenY;
  const width = window.outerWidth;
  const height = window.outerHeight;
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  return { x, y, width, height, centerX, centerY };
};

// Send updated metrics to the SharedWorker
const trackMyWindowMetrics = () => {
  const metrics = calculateMetrics();

  const unchanged =
    metrics.x === myWindowMetrics.x &&
    metrics.y === myWindowMetrics.y &&
    metrics.width === myWindowMetrics.width &&
    metrics.height === myWindowMetrics.height;

  if (unchanged) return;

  Object.assign(myWindowMetrics, metrics);

  worker.port.postMessage({
    id: myId,
    type: 'metrics',
    metrics: myWindowMetrics
  });

  updateMetricsInUI('data-js-my-metrics', myWindowMetrics);
};

// Initial update and interval
// trackMyWindowMetrics();
// const observeMyWindowMetrics = setInterval(trackMyWindowMetrics, 500);

// Initial fetch
worker.port.postMessage({ type: 'getOtherMetrics', id: myId });

// Receive updates from the SharedWorker
worker.port.onmessage = (event) => {
  if (!event.data) return;
  const msg = event.data;

  if (msg.type === 'update') {
    Object.assign(otherWindowMetrics, msg.metrics);
    updateMetricsInUI('data-js-other-metrics', otherWindowMetrics);
  }

  if (msg.type === 'otherMetrics') {
    if (msg.data.length === 0) return;
    const first = msg.data[0];
    Object.assign(otherWindowMetrics, first.metrics);
    updateMetricsInUI('data-js-other-metrics', otherWindowMetrics);
  }

  if (msg.type === 'myMetrics') {
    console.log('My window metrics:', msg.metrics);
    updateMetricsInUI('data-js-my-metrics', msg.metrics); // optional fallback
  }
};



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
  stroke(200);
  strokeWeight(2);

  skewAdd = random(0.1, 0.5);

}


function draw() {

  // Shorten the names, so we can use them more easily
  const {innerRadius1, innerRadius2, outerRadius1, outerRadius2} = drawingParams;

  // Track window metrics with every draw cal
  trackMyWindowMetrics();

  // Move the origin of the canvas to the top left corner of the screen
  moveOriginOfCanvaa();

  // Objects are rotated around the center of the screen to look at each other
  angle = atan2(otherWindowMetrics.centerY - myWindowMetrics.centerY, otherWindowMetrics.centerX - myWindowMetrics.centerX);
  translate(myWindowMetrics.centerX, myWindowMetrics.centerY);
  rotate(angle);
  translate(-myWindowMetrics.centerX, -myWindowMetrics.centerY);

  // Create a complementary color
  const colorAdd = map(myWindowMetrics.x, 0, width, 0, drawingParams.colorHueMax);

  // Clear the canvas
  background(0, 0, 0, drawingParams.backgroundAlpha);

  // Get distance between the two windows
  const distanceBetweenWindows = dist(myWindowMetrics.centerX, myWindowMetrics.centerY, otherWindowMetrics.centerX, otherWindowMetrics.centerY);

  // Move the center a bit
  const shiftCenter = otherWindowMetrics.centerX 
    ? map(distanceBetweenWindows, 0, screen.width /2, 0, window.innerWidth / 2)
    : 0;
  translate(myWindowMetrics.centerX, myWindowMetrics.centerY);

  // How many steps to draw
  const segments = 360 / drawingParams.steps;

  for (let angle = 0; angle < 360; angle += segments) {

    // Calculate the noise offset based on the angle
    const xoff = cos(angle) + 1;
    const yoff = sin(angle) + 1;

    // Noise is used to add some vitality to the lines
    const vitality = drawingParams.vitality > 0 ? noise(xoff * 2, yoff *2, timeForNoise) * (drawingParams.vitality * 2) : 0;

    // Brightness is mapped to the angle
    // and the lines are drawn with a gradient
    const bri = map(angle, 0, 360, 100, 30);
    
    strokeWeight(1);
    stroke(drawingParams.colorHue + colorAdd, 80, bri, drawingParams.foregroundAlpha);
    const x1 = cos(angle + skew) * innerRadius2 + shiftCenter /2 + vitality;
    const y1 = sin(angle + skew) * innerRadius1 + vitality;
    const x2 = cos(angle) * outerRadius1 + vitality;
    const y2 = sin(angle) * outerRadius2 + vitality;
    line(x1, y1, x2, y2);
  }

  // Should we skew the lines?
  skew += drawingParams.rotate === true ? skewAdd : 0;

  // Letting time progress = movement
  timeForNoise += 0.005

}




