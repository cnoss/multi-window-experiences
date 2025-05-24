# Assignment Brief: Multi-Window, Simple Object

**Title:**
*Draw a Line Across Two Browser Windows*

**Objective:**
Create a visual composition where a single line spans across two separate browser windows. The goal is to make it feel like both windows are showing different parts of a single, shared scene.

**What you'll learn:**

* How to coordinate drawing across multiple windows
* How to share data using browser-native technologies
* How to think spatially beyond the boundaries of a single window or canvas

**Requirements:**

* Two (or more) browser windows must be open
* The start and end points of the line must be distributed between them
* The line should appear coherent and continuous, even though it is rendered in separate canvases
* Use a communication method to synchronize data between the windows

**Tools:**
You can use [`SharedWorker`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker), or try out other approaches like `window.opener`, `postMessage`, or `localStorage`.



## Implementation Hints

* **Use screen coordinates** to calculate where the line begins and ends on the desktop, not just inside the canvas.
* In each window, calculate its current **screen position** using `window.screenX` and `window.screenY`.
* Adjust the drawing position by **subtracting the window position** from the shared screen coordinates.
* Use a [`SharedWorker`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) to store and update the line’s global start and end points.
* Each window only needs to draw the part of the line that falls within its visible canvas area.
* Start simple: use one window to set the start point, and the other to set the end point.
* You can use `setInterval()` or a frame loop (`draw()`) to continuously check for updates.

