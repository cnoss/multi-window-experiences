const addScreenDataLogger = () => {
  const target = document.querySelector('#logger-wrap');
  if (!target) {
    target = document.createElement('div');
    target.id = 'logger-wrap';
    document.body.appendChild(target);
  }

  const existingLogger = document.getElementById('screen-data-logger');

  if (existingLogger) {
    console.warn('Screen data logger already exists');
    return existingLogger;
  }

  const logger = document.createElement('div');
  logger.id = 'screen-data-logger';
  logger.className = 'logger';

  logger.innerHTML = `
    <h2><span class="icon">📺</span> Bildschirm-Informationen</h2>
    <p id="screen-logging-time"></p>
    <dl id="screen-data"></dl>
  `;
  target.appendChild(logger);
  return logger;
};


const updateScreenData = (screenInfo) => {
  window.AppData.screenInfo.data = screenInfo;
  window.AppData.screenInfo.time = new Date().toLocaleTimeString();
};

const displayScreenData = (screenData) => {

  const screenInfo = window.AppData.screenInfo;
  const fragment = document.createDocumentFragment();

  Object.entries(screenInfo.data).forEach(([key, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = key;
    const dd = document.createElement('dd');
    dd.textContent = value;
    fragment.appendChild(dt);
    fragment.appendChild(dd);
  });
  screenData.appendChild(fragment);

  const timeEl = document.getElementById('screen-logging-time');
  if (!timeEl) return;

  const timeString = new Date().toLocaleTimeString(); // oder .toISOString() für UTC
  timeEl.textContent = `🕒 ${timeString}`;
};


/* Exports
############################################################################# */

export const getScreenInfo = () => {
  const screenData = {
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
    devicePixelRatio: window.devicePixelRatio,
    orientation: screen.orientation ? screen.orientation.type : 'Screen orientation not supported by your browser',
  }

  updateScreenData(screenData);
  return screenData;
};
  



export const printScreenInfo = () => {
  const logger = addScreenDataLogger();
  if (!logger) {
    console.error('Logger-Element nicht gefunden');
    return;
  }
  const screenDataLogger = document.getElementById('screen-data');
  if (!screenDataLogger) {
    console.error('Screen data element not found');
    return;
  }
  const info = getScreenInfo();
  updateScreenData(info);
  displayScreenData(screenDataLogger);
};

