/* Exports
############################################################################# */

export const addPositionGrid = () => {

  const target = document.querySelector("[data-position-grid]");
  if (!target) return;

  const gridDimensions = target.dataset.positionGrid.split('x');
  const cols = parseInt(gridDimensions[0], 10);
  const rows = parseInt(gridDimensions[1], 10);

  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < cols; col++) {
      const cellElement = document.createElement('div');
      cellElement.className = 'grid-cell';
      cellElement.dataset.positionGridCell = `${col}-${row}`;
      target.appendChild(cellElement);
    }
  }
};

export const positionWindow = (cellElement) => {
  const cellPosition = cellElement.dataset.positionGridCell.split('-');
  const col = parseInt(cellPosition[0], 10);
  const row = parseInt(cellPosition[1], 10);

  const appData = window.opener.AppData;

  const width = appData.screenInfo.data.width / appData.grid.cols;
  const height = appData.screenInfo.data.height / appData.grid.rows;

  const posX = Math.round(col * width);
  const posY = Math.round(row * height);

  window.moveTo(posX, posY);

  console.log(`Positioning window at column ${col}, row ${row}`);

}