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


// Move the origin of the canvas to the top left corner of the screen
function moveOriginOfCanvaa(){
  const originX = -window.screenX;
  const originY = -window.screenY;
  translate(originX, originY);
}

// Update the metrics in the UI
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

// Calculate metrics of the current window
const calculateMetrics = () => {
  const x = window.screenX;
  const y = window.screenY;
  const width = window.outerWidth;
  const height = window.outerHeight;
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  return { x, y, width, height, centerX, centerY };
};

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

  // ##########################################################################
  // ToDo: Send my metrics to the SharedWorker
  /* … */
  
  // Example of how to update the metrics in the UI
  updateMetricsInUI('data-js-my-metrics', myWindowMetrics);

};


worker.port.postMessage({ type: 'getOtherMetrics', id: myId });

// Receive updates from the SharedWorker
worker.port.onmessage = (event) => {
  if (!event.data) return;
  const msg = event.data;

  // ##########################################################################
  // ToDo:  Receive updates from the SharedWorker and 
  //        update the otherWindowMetrics object
  /* … */
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

  // ##########################################################################
  // ToDo:  Track the metrics of the current window
  /* … */

  // Move the origin of the canvas to the top left corner of the screen
  moveOriginOfCanvaa();
  
  // ##########################################################################
  /* Provide your code below */
  /* ⬇️ */


}




