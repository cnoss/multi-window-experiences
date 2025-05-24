// Central data structure: stores the positions of all connected windows (by ID)
const state = {};

// List of all connected windows (MessagePorts)
const connections = [];

// Called when a window sends its current position. The position is stored and forwarded to all other windows.
const updatePosition = (msg, port) => {
  
  // Save the window's position under its ID
  state[msg.id] = { position: msg.position, time: Date.now() };

  // Send message to all other windows (except the sender)
  connections.forEach(p => {
    if (p !== port) {
      p.postMessage({ type: 'update', id: msg.id, position: msg.position });
    }
  });
};

// A window requests its own stored position.
const getMyPosition = (msg, port) => {
  const myState = state[msg.id];

  port.postMessage({
    type: 'myPosition',
    position: myState ? myState.position : null
  });
};

// A window requests the positions of all other windows.
const getOtherPositions = (msg, port) => {
  const otherPositions = Object.keys(state)
    .filter(id => id !== msg.id) // all except the requesting window
    .map(id => ({
      id: id,
      position: state[id].position
    }));

  port.postMessage({ type: 'otherPositions', data: otherPositions });
};

// Called when a new window connects to the worker.
onconnect = function (e) {

  const port = e.ports[0];  // the communication channel to this window
  connections.push(port);  // store it for later use

  // When this window sends a message ...
  port.onmessage = function (event) {
    const msg = event.data;

    // Check message type and call appropriate handler
    switch (msg.type) {
      case 'position': // window sends its current position
        updatePosition(msg, port);
        break;

      case 'getMyPosition': // window requests its own stored position
        getMyPosition(msg, port);
        break;

      case 'getOtherPositions': // window requests positions of other windows
        getOtherPositions(msg, port);
        break;

      default: 
        console.warn('Unbekannter Nachrichtentyp:', msg.type);
    }
  };

  port.start(); // Activate the port (important for older browsers)
};