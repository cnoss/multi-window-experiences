let posX, posY;

function draw() {
  background(0, 0, 0, 100);

  if (drawingParams.context === 'screen') {
    // Move the origin of the canvas to the top left corner of the screen
    const originX = -window.screenX;
    const originY = -window.screenY;
    canvas.width = screen.width;
    canvas.height = screen.height;
    translate(originX, originY);
    posX = width / 2;
    posY = height / 2;

  }else{
    posX = window.innerWidth / 2;
    posY = window.innerHeight / 2;
  }

  ellipse(posX, posY, 60, 60);
}