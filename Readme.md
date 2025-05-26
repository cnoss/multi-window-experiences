#  Multi-Window Experiences with p5.js

A playground and workshop exploring how multiple browser windows can share data, synchronize visuals, and interact across screen space using native browser technologies.

This workshop is part of the module [**Web Technologies**](https://th-koeln.github.io/mi-master-wtw/web-technologien/) in the MA program *Media Informatics* and *Digital Sciences* at TH Köln.

The code deliberately focuses on **standardized browser technologies** and aims to work with **minimal dependencies**. It does **not require any build tools**. All sketches and assignments are written in plain HTML, JavaScript, and CSS using browser-native APIs. You only need a static HTTP server to run the examples — no bundling, transpiling, or compilation is necessary.


To run this project locally, an **HTTP server** is required. You can use [BrowserSync](https://browsersync.io/) (as configured via `npm  start`), but any static server will work — for example, the built-in live server in your IDE (such as VS Code's "Live Server" extension) or Python’s simple HTTP server. The project is designed to run without a build step, so you can work directly with the files.

There is a [Slide Deck](https://cnoss.github.io/slides/presentations/misc/multi-window-with-p5/) available for the workshop.

Inspired by [Björn Staal](https://github.com/bgstaal/multipleWindow3dScene). 

---

## 🚀 Getting Started

To run the sketches and assignments locally:

### Clone this repository:
   ```bash
   git clone https://github.com/cnoss/multi-window-experiences.git
   cd multi-window-experiences
   ```

### Use a local http server or install browsersync as dev server:
   ```bash
   npm install
   npm start
   ```

This uses [BrowserSync](https://browsersync.io/) to live-reload any file changes and serve the sketches via `localhost`.


---

## ✨ Example Assignments

- **01: Share Position Data**  
  Exchange each window’s screen coordinates and display them.

- **02: Draw a Line Between Windows**  
  Use global screen positions to draw a continuous line across two canvases.

- **03: Multi-Window Visualization**  
  Explore experimental visuals distributed across windows.

- **04: Visual Handoff**  
  When two windows overlap, a shared graphic moves from one to the other.

Each assignment comes with a short brief, starter code, and optional challenges.


---

## 📚 Further Reading

- [MDN: SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker)
- [MDN: BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
- [MDN: window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [p5.js Reference](https://p5js.org/reference/)


---

## 💡 Credits

Created by [Christian Noss](https://christiannoss.de)  
Workshop developed for students in the **Media Informatics** and **Digital Scienes** program.  
Built with [p5.js](https://p5js.org) and the browser as a canvas.
