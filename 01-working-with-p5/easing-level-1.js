let followerX, followerY;
let easing = 0.05;

function setup() {
  createCanvas(600, 400);
  followerX = width / 2;
  followerY = height / 2;
}

function draw() {
  background(240);

  // Easing calculation: smooth movement toward the target
  let dx = mouseX - followerX;
  let dy = mouseY - followerY;

  followerX += dx * easing;
  followerY += dy * easing;

  fill(50);
  noStroke();
  ellipse(followerX, followerY, 20, 20);
}
