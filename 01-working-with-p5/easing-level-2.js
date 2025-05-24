let follower;
let velocity;

function setup() {
  createCanvas(600, 400);
  follower = createVector(width / 2, height / 2);
  velocity = createVector(0, 0);
}

function draw() {
  background(240);

  const target = createVector(mouseX, mouseY);
  const dir = p5.Vector.sub(target, follower);

  // apply easeOutBack dynamics 
  const stiffness = 0.1;      // how strong the spring pulls
  const damping = 0.8;        // how much the movement is slowed
  const backforce = 0.5;      // "overshoot" factor (more = stronger bounce)

  // artificial backforce: we scale the pull vector slightly beyond the target
  dir.mult(backforce);

  // acceleration = pull force
  const acceleration = dir.mult(stiffness);

  // velocity += acceleration, then apply damping
  velocity.add(acceleration);
  velocity.mult(damping);

  // move follower
  follower.add(velocity);

  // draw follower
  fill(50);
  noStroke();
  ellipse(follower.x, follower.y, 20, 20);
}
