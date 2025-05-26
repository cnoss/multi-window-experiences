/* ############################################################################ 
Kurs «Generative Gestaltung» an der TH Köln
Christian Noss
christian.noss@th-koeln.de
https://twitter.com/cnoss
https://cnoss.github.io/generative-gestaltung/

############################################################################ */



/* ###########################################################################
Classes
############################################################################ */


/* ###########################################################################
Custom Functions
############################################################################ */

function showCross() {
  line(
    0, 0, screen.width, screen.height
  );
  line(
    screen.width, 0, 0, screen.height
  );
}

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
  strokeWeight(5);

}


function draw() {
  stroke(drawingParams.colorHue, 70, 100, 100);
  background(0, 0, 0, drawingParams.backgroundAlpha);

  // Track window metrics with every draw
  trackMyWindowMetrics();

  // Move the origin of the canvas to the top left corner of the screen
  moveOriginOfCanvaa();

  // Draw a cross in the center of the screen
  // showCross();

  // Draw line
  line(
    myWindowMetrics.centerX, myWindowMetrics.centerY,
    otherWindowMetrics.centerX, otherWindowMetrics.centerY
  );

}




