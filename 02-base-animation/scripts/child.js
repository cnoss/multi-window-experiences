import { addPositionGrid, positionWindow } from './position-grid.js';

let lastX = window.screenX;
let lastY = window.screenY;

const slug = window.name.replace(/\s+/g, '-').toLowerCase();
const windowData = window.opener.AppData.windows.find(window => window.slug === slug);


/* Functions
############################################################################# */

const checkAndSendPosition = () => {
  const currentX = window.screenX;
  const currentY = window.screenY;

  if (currentX !== lastX || currentY !== lastY) {
    lastX = currentX;
    lastY = currentY;

    windowData.position.x = currentX;
    windowData.position.y = currentY;

    window.opener?.postMessage({
      type: 'position',
      from: slug,
      coords: { x: currentX, y: currentY }
    }, '*');

  }
}


const setWindowTitle = () => {

  const titleElement = document.querySelector('[data-title]');
  const urlParams = new URLSearchParams(window.location.search);
  const title = urlParams.get('title');
  titleElement.textContent = title || 'Fenster A';
  document.title = title || 'Fenster A';
  window.name = title || 'Fenster A';
}

export const trackPosition = (event) => {
  setInterval(checkAndSendPosition, 100, event);
};


/* Main
############################################################################# */

document.addEventListener('DOMContentLoaded', () => {

  setWindowTitle();
  trackPosition();
  addPositionGrid();

  
  /* Click Listener
  ############################################################################ */
  
  document.body.addEventListener('click', function(event) {
    const clickedElement = event.target;
  
    // Position Grid
    if (clickedElement.closest('[data-position-grid-cell]')) {
      positionWindow(clickedElement);
    }
    
  });
});

