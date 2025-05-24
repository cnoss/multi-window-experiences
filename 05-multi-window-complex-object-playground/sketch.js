/* ############################################################################ 
Kurs «Generative Gestaltung» an der TH Köln
Christian Noss
christian.noss@th-koeln.de
https://twitter.com/cnoss
https://cnoss.github.io/generative-gestaltung/

############################################################################ */

let skew = 0;

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

}


function draw() {

  const color1 =   color(drawingParams.colorHue, 70, 100, drawingParams.foregroundAlpha);
  const color2 =   color(drawingParams.colorHue + 180, 70, 100, drawingParams.foregroundAlpha);

  const outerRadius1 = drawingParams.outerRadius1;
  const outerRadius2 = drawingParams.outerRadius2;
  const innerRadius1 = drawingParams.innerRadius1;
  const innerRadius2 = drawingParams.innerRadius2;

  background(0, 0, 0, drawingParams.backgroundAlpha);

  // Track window metrics with every draw cal
  trackMyWindowMetrics();

  // Move the origin of the canvas to the top left corner of the screen
  moveOriginOfCanvaa();

  translate(myWindowMetrics.centerX, myWindowMetrics.centerY);

  const segments = 360 / drawingParams.steps;

  for (let angle = 0; angle < 360; angle += segments) {

    strokeWeight(1);
    stroke(color1);
    const x1 = cos(angle + skew) * innerRadius2 * 1.2 - myWindowMetrics.x;
    const y1 = sin(angle + skew) * innerRadius1 * 1.2 - myWindowMetrics.y;
    const x2 = cos(angle) * outerRadius1 + otherWindowMetrics.x;
    const y2 = sin(angle) * outerRadius2 + otherWindowMetrics.y;
    line(x1, y1, x2, y2);

    strokeWeight(2);
    stroke(color2);
    const x1_1 = cos(angle + skew) * innerRadius2;
    const y1_1 = sin(angle + skew) * innerRadius1 - myWindowMetrics.y;
    const x2_1 = cos(angle) * outerRadius2 + otherWindowMetrics.x;
    const y2_1 = sin(angle) * outerRadius1 + otherWindowMetrics.y;
    line(x1_1, y1_1, x2_1, y2_1);
  }

  skew += drawingParams.skewAdd === true ? 0.5 : 0;

}




