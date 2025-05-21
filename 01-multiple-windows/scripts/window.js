import { updateLogger } from "./logger.js";

const gridPointer = {
  col: 0,
  row: 0
};

const addChildLogger = (slug, name) => {
  const target = document.querySelector('#logger-wrap');
  const logger = document.createElement('div');
  logger.id = `logger-${slug}`;
  logger.className = 'logger';

  logger.innerHTML = `
    <h2><span class="icon">🪟</span>&nbsp;${name}</h2>
    <p id="window-logging-time"></p>
    <dl id="window-data"></dl>
  `;
  target.appendChild(logger);
}



/* Exports
############################################################################# */

export const addNewWindow = () => {

  const existingWindows = window.AppData.windows;
  const newWindowName = `Kind Fenster ${existingWindows.length + 1}`;

  const width = window.AppData.screenInfo.data.width / window.AppData.grid.cols;
  const height = window.AppData.screenInfo.data.height / window.AppData.grid.rows;
  const id = existingWindows.length + 1;
  const slug = newWindowName.toLowerCase().replace(/\s+/g, '-');

  const posX = Math.round(gridPointer.col * width);
  const posY = Math.round(gridPointer.row * height);
  gridPointer.col = gridPointer.col < window.AppData.grid.cols - 1 ? gridPointer.col + 1 : 0;
  gridPointer.row = gridPointer.col === 0 ? (gridPointer.row < window.AppData.grid.rows - 1 ? gridPointer.row + 1 : 0) : gridPointer.row;

  const newWindowData = {
    name: newWindowName,
    id: id,
    slug: slug,
    position: {
      x: posX,
      y: posY
    },
    size: {
      width: width,
      height: height
    }
  };

  // Check if the window already exists
  const existingWindow = existingWindows.find(window => window.name === newWindowName);
  if (existingWindow) {
    console.warn(`Fenster mit dem Namen "${newWindowName}" existiert bereits.`);
    return;
  }

  const newWindow = window.open(`kind.html?title=${newWindowName}&id=${id}`, 
    newWindowName, 
    `width=${newWindowData.size.width}, height=${newWindowData.size.height}, top=${newWindowData.position.y}, left=${newWindowData.position.x}`
  );

  newWindowData.window = newWindow;
  window.AppData.windows.push(newWindowData);
  
  addChildLogger(slug, newWindowName);
  updateLogger(slug);
  
};


export const closeWindows = () => {
  const existingWindows = window.AppData.windows;
  existingWindows.forEach(windowData => {
    if (windowData.window) {
      windowData.window.close();
    }
  });
  window.AppData.windows = [];
};