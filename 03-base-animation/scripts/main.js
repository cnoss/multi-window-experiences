import { getScreenInfo, printScreenInfo } from './screen.js';
import { addNewWindow, closeWindows } from './window.js';
import { positionWindow } from './position-grid.js';
import { updateLogger } from './logger.js';


window.AppData = window.AppData || {
  screenInfo: {},
  windows: [],
  grid: {
    cols: 3,
    rows: 3
  }
};


/* DOM Loaded
############################################################################ */
document.addEventListener('DOMContentLoaded', () => {
  getScreenInfo();
  
    printScreenInfo();
    window.addEventListener('message', (event) => {
      if (event.data?.type === 'position') {
        
        updateLogger(event.data.from);
      }
    });
});


/* Click Listener
############################################################################ */

document.body.addEventListener('click', function(event) {
  const clickedElement = event.target;

  // New Window
  if (clickedElement.closest('[data-new-window]')) {
    addNewWindow();
  }

  if(clickedElement.closest('[data-close-windows]')) {
    closeWindows();
  }

  // Position Grid
  if (clickedElement.closest('[data-position-grid-cell]')) {
    positionWindow(clickedElement);
  }
  
});

