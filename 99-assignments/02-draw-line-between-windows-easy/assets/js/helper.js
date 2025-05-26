/* ----------------------------------------------------------------------------
helper.js                                                                
Enthält ein paar kleine Helferlein für die Sketches in Generative Gestaltung. 
Kurs «Generative Gestaltung» an der TH Köln
Christian Noss
christian.noss@th-koeln.de
https://twitter.com/cnoss
https://cnoss.github.io/generative-gestaltung/
----------------------------------------------------------------------------*/



/* Config & Vars
----------------------------------------------------------------------------*/

let helperGlobals = {
  nav: document.getElementById("nav"),
  canvas: document.getElementById("canvas"),
  console: document.getElementById("console"),
  consoleStates: 
    [ 
      'is-fixed',
      'is-standard',
      'is-fullscreen',
      'is-16by9',
      'is-small',
      'is-large'
    ]
};



/* Functions
----------------------------------------------------------------------------*/

function helperPrettifyLogs(data) {
  return JSON.stringify(data).replace(/{|}|"/g, "").replace(/,/g, " // ");
}

function helperNavElements() {
  
  function pimpConsole() { 
    let drawingParams = document.createElement("p");
    drawingParams.setAttribute("id", "drawingParams");
    helperGlobals.console.appendChild(drawingParams);

    let canvasParams = document.createElement("p");
    canvasParams.setAttribute("id", "canvasParams");
    helperGlobals.console.appendChild(canvasParams);
  }

  function checkWrap() { 
    let navWrap = document.querySelector("#nav-wrap");
    if (navWrap === null) {
      let navWrap = document.createElement("div");
      navWrap.setAttribute("id", "nav-wrap");
      navWrap.classList.add("nav-wrap");
      var mainNav = document.getElementById("nav");
      mainNav.appendChild(navWrap);
      return document.querySelector("#nav-wrap");
    } else { 
      return navWrap;
    }
  }

  function generateNavitems() { 

    let navWrap = checkWrap();
    
    let navItem = document.createElement("div");
    navItem.classList.add("nav-item");
    navItem.classList.add("button");
    navItem.setAttribute("id", "nav-item-button");
    
    /* Info Toggling */
    let infoButton = document.createElement("i");
    infoButton.setAttribute("class", "material-icons button");
    infoButton.addEventListener("click", function () { 
      helperGlobals.console.classList.toggle('active');
      this.classList.toggle('active');
    }, false);

    let icon = document.createTextNode("info"); 
    infoButton.appendChild(icon);
    navItem.appendChild(infoButton);

    /* Adding Child Windows Button */
    addChildWindowButton = document.createElement("i");
    addChildWindowButton.setAttribute("class", "material-icons button");
    addChildWindowButton.addEventListener("click", function () {

      const childWindowName = childWindowPrefix + (windowCollection.length);
      const childWindowWidth = Math.floor(screen.availWidth/2);
      const childWindowHeight = Math.floor(screen.availHeight/2);
      const childWindow = new Window(childWindowName, "child", childWindowWidth, childWindowHeight);
      childWindow.open();
      windowCollection.push(childWindow);
          
    }, false);

    icon = document.createTextNode("add"); 
    addChildWindowButton.appendChild(icon);
    navItem.appendChild(addChildWindowButton);
    
    navWrap.appendChild(navItem);
    
  }
  this.init = function () { 
    pimpConsole();
    generateNavitems(); 
  }
}


/* Main
----------------------------------------------------------------------------*/

