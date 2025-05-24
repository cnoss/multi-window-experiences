/* Exports
############################################################################# */

export const updateLogger = (slug) => {
  const id = `logger-${slug}`;
  const logger = document.getElementById(id);
  if (!logger) {
    console.warn(`Logger für ${slug} nicht gefunden.`);
    return;
  }

  const targetLoggingTime = logger.querySelector('#window-logging-time');
  const targetData = logger.querySelector('#window-data');

  const timeString = new Date().toLocaleTimeString(); // oder .toISOString() für UTC
  targetLoggingTime.textContent = `🕒 ${timeString}`;

  const windowData = window.AppData.windows.find(window => window.slug === slug);
  if (!windowData) {
    console.warn(`Fenster-Daten für ${slug} nicht gefunden.`);
    return;
  }

  const positionHtml = `
    <dt>X-Position</dt>
    <dd>${windowData.position.x}px</dd>
    <dt>Y-Position</dt>
    <dd>${windowData.position.y}px</dd>

  `;

  targetData.innerHTML = positionHtml;

  
}