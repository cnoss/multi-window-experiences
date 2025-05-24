// shared.js
const connections = [];

onconnect = function (e) {
  const port = e.ports[0];
  connections.push(port);

  port.onmessage = function (event) {
    const data = event.data;
    console.log('[Worker] received:', data);

    // Echo to all other windows
    connections.forEach(p => {
      if (p !== port) {
        p.postMessage(data);
      }
    });
  };

  port.start(); // Required for older browsers
};