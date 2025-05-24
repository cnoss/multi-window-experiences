

let r = 1;
let skewDirection = 1;
let skew = 1;
let or1Direction = -1;
let or1 = 100;
let ir1Direction = 0.5;
let ir1 = 100;
let xoff = 0;
let yoff = 0;

// const bc = new BroadcastChannel("test_channel");

let t = 0; // Zeitoffset für Perlin Noise
let distanceBetweenWindows = 0;

window.thisWindowContext = window.name === "Root" ? window : window.opener;

function drawForm(){

    const thisWindowContext = window.name === "Root" ? window : window.opener;

  // console.log(thisWindowContext.windowCollection);

  const window1 = thisWindowContext.windowCollection[0];
  const window2 = thisWindowContext.windowCollection[1];



  if (window1 && window2) {
    distanceBetweenWindows = map(getDistance(window1, window2), 0, width, 0, 100);
  }

  
    

  translate(width / 2, height / 2); // Zentrum verschieben
noFill();
  stroke(0, 50, 100, 100);
  strokeWeight(2);
  beginShape();
  let totalPoints = 1000;
  for (let a = 0; a < 360; a += 50) {
    let xoff = cos(a) + 1;  // Werte von 0 bis 2
    let yoff = sin(a) + 1;

    // Noise abhängig von Winkel + Zeit
    let r = 100 + noise(xoff * 2, yoff *2, t) * 200;

    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);

    beginShape();
  
  for (let a = 0; a < 360; a += 50) {
    let xoff = cos(a) + 1;  // Werte von 0 bis 2
    let yoff = sin(a) + 1;

    // Noise abhängig von Winkel + Zeit
    let r = 100 + noise(xoff * 2, yoff *2, t) + distanceBetweenWindows;

    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);

  t += 0.01; // Zeit fortschreiten lassen = Bewegung
}

function drawFunkyObject() {

      

  const posX = width / 2;
  const posY = height / 2;
  let radius = 10;
  let angle = 0;
  let shiftX = 0;
  // let n = noise(xoff, yoff);  // ergibt einen Wert zwischen 0 und 1
  // let pos = n * 10;  // z.B. für Positionen verwenden


  const thisDP = thisWindowContext.drawingParams;

  // console.log(thisWindowContext.windowCollection);

  const window1 = thisWindowContext.windowCollection[0];
  const window2 = thisWindowContext.windowCollection[1];




  if (window1 && window2) {
    distanceBetweenWindows = getDistance(window1, window2);

      const me = window.name === "Root" ? window1 : window2;
      const opposite = window.name === "Root" ? window2 : window1;

      
    const windowMetrics = getMetricsFromWindows();
    const myPositionOnScreen = windowMetrics[me.id].pos;
    const oppositePositionOnScreen = windowMetrics[opposite.id].pos;
    
    angle = atan2(myPositionOnScreen.y - oppositePositionOnScreen.y, myPositionOnScreen.x - oppositePositionOnScreen.x) +180;
    const leftOrRight = windowMetrics[me.id].area === "left" ? -1 : 1;
    shiftX = map(distanceBetweenWindows / 2, 0, screen.availWidth / 2, 0, width/2) * leftOrRight;
  }

  

xoff += 0.1;
yoff += 0.1;

background(0,0,0, thisDP.bgalpha);

    // Noise abhängig von Winkel + Zeit
    let r = 100 + noise(xoff * 2, yoff *2, t);



  translate(width / 2, height / 2);
  
  
  
  rotate(angle);
translate(shiftX, 0);

  randomSeed(0);
  //rotate(r); r += 0.2;

  // skew += skewDirection;
  // if (skew > thisDP.skewMax) { skewDirection = -1; }
  // if (skew < thisDP.skewMin) { skewDirection = 1; }

  //or1 += or1Direction;
  // const innerRadius1Max = 
  // if (or1 > thisDP.outerRadius1Max) { or1Direction = -1; }
  // if (or1 < thisDP.outerRadius1Min) { or1Direction = 1; }
// 
  // ir1 += ir1Direction * 2;
  // if (ir1 > thisDP.innerRadius1Max) { ir1Direction = -1; }
  // if (ir1 < thisDP.innerRadius1Min) { ir1Direction = 1; }

  let r1 = 400;
  let r2 = 200;
  let steps = 360 / thisDP.steps;

  let mean = thisDP.randomMean;


  const innerRadius1 = thisDP.innerCircleRadius * thisDP.innerCircleMultiplier;
  const innerRadius2 = innerRadius1 * thisDP.innerCircleRatio;
  const outerRadius1 = thisDP.outerCircleRadius * thisDP.outerCircleMultiplier;
  const outerRadius2 = outerRadius1 * thisDP.outerCircleRatio;

  

  for (let angle = 0; angle < 360; angle += steps) {

        let xoff = cos(angle) + 1;  // Werte von 0 bis 2
    let yoff = sin(angle) + 1;

        let lobs = (noise(xoff * 20, yoff *20, t) * 5 * map(distanceBetweenWindows, screen.availWidth / 2, 0, 100, 0)) * thisDP.exitement * 0.01;

        

    strokeWeight(1);
      let sd = thisDP.randomDeviation; // * random(0, 1);
    const random1 = randomGaussian() * sd + mean;
    const random2 = randomGaussian() * sd + mean;

    stroke(thisDP.hue + angle, thisDP.sat, thisDP.bri, thisDP.alpha - map(angle, 0, 360, 0, 80));
    const x1 = cos(angle + skew) * innerRadius1;
    const y1 = sin(angle + skew) * innerRadius2;
    const x2 = cos(angle) * outerRadius1;
    const y2 = sin(angle) * outerRadius2;
    line(x1 + lobs, y1 - random2, x2 - random2, y2 + lobs);
  }

  t += 0.01; // Zeit fortschreiten lassen = Bewegung
}


function getPosition(windowObj) {
  if (!windowObj) {
    console.error("Window object is null or undefined.");
    return null;
  }

  return { x: windowObj.x, y: windowObj.y };

}

function getDistance(windowObj1, windowObj2, origin = "center") {


  if (windowObj1 && windowObj2) {
    const addXWindow1 = origin === "center" ? windowObj1.width / 2 : 0;
    const addYWindow1 = origin === "center" ? windowObj1.height / 2 : 0;
    const addXWindow2 = origin === "center" ? windowObj2.width / 2 : 0;
    const addYWindow2 = origin === "center" ? windowObj2.height / 2 : 0;

    return dist(
      windowObj1.x + addXWindow1,
      windowObj1.y + addYWindow1,
      windowObj2.x + addXWindow2,
      windowObj2.y + addYWindow2
    );

  } else {
    console.error(`One or both windows not found.`);
    return null;
  }
}

function getMetricsFromWindows() {

  if (!thisWindowContext.windowCollection || thisWindowContext.windowCollection.length < 2) return false;

  const distance = getDistance(thisWindowContext.windowCollection[0], thisWindowContext.windowCollection[1]);

  const nameWindow1 = thisWindowContext.windowCollection[0].id;
  const nameWindow2 = thisWindowContext.windowCollection[1].id;
  const posWindow1 = getPosition(thisWindowContext.windowCollection[0]);
  const posWindow2 = getPosition(thisWindowContext.windowCollection[1]);

  const windowMetrics = {};
  windowMetrics[nameWindow1] = {
    name: nameWindow1,
    distance: distance,
    pos: posWindow1,
    area: posWindow1 < screen.availWidth / 2 ? "left" : "right"
  };
  windowMetrics[nameWindow2] = {
    name: nameWindow2,
    distance: distance,
    pos: posWindow2,
    area: posWindow1 < screen.availWidth / 2 ? "left" : "right"
  };


  return windowMetrics;

}