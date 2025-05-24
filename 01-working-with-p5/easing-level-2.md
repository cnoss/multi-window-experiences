```javascript
let follower;
let velocity;
```

* `follower`: The current position of the object (as a `p5.Vector`)
* `velocity`: The current speed and direction of movement

---

```javascript
function setup() {
  createCanvas(600, 400);
  follower = createVector(width / 2, height / 2);
  velocity = createVector(0, 0);
}
```

* Set up the canvas and initialize the follower in the center of the screen
* Start with no movement (`velocity = 0`)

---

```javascript
function draw() {
  background(240);
```

* Clear the screen each frame with a light gray background

---

```javascript
  let target = createVector(mouseX, mouseY);
  let dir = p5.Vector.sub(target, follower);
```

* Create a vector pointing from the follower toward the mouse
* `dir` is the direction and distance the follower needs to move

---

```javascript
  let stiffness = 0.1;
  let damping = 0.8;
  let backforce = 1.5;
```

* **`stiffness`**: How strong the pull toward the target is (like a spring)
* **`damping`**: How much the movement slows down over time (friction)
* **`backforce`**: How much to *overshoot* the target (for the “ease out back” feel)

---

```javascript
  dir.mult(backforce);
  let acceleration = dir.mult(stiffness);
```

* First: exaggerate the direction vector slightly → overshoot
* Then: scale it down again → creates acceleration (force)

---

```javascript
  velocity.add(acceleration);
  velocity.mult(damping);
```

* Add the acceleration to the current velocity (classic physics)
* Apply damping to slow it down (otherwise it would vibrate forever)

---

```javascript
  follower.add(velocity);
```

* Move the follower by adding the current velocity to its position

---

```javascript
  fill(50);
  noStroke();
  ellipse(follower.x, follower.y, 20, 20);
}
```

* Draw the follower as a dark circle at its current position
