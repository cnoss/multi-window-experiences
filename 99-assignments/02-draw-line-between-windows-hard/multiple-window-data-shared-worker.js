// Stores the current metrics of each connected window by ID
const state = {};

// Keeps track of all active connections (MessagePorts)
const connections = [];

/**
 * When a window sends updated metrics, store them and notify others.
 */
const updateMetrics = (msg, port) => {
  state[msg.id] = {
    metrics: msg.metrics,
    time: Date.now()
  };

  // Broadcast update to all other connected windows
  connections.forEach(p => {
    if (p !== port) {
      p.postMessage({
        type: 'update',
        id: msg.id,
        metrics: msg.metrics
      });
    }
  });
};

/**
 * Responds with this window's last known metrics (from state).
 */
const getMyMetrics = (msg, port) => {
  const myState = state[msg.id];

  port.postMessage({
    type: 'myMetrics',
    metrics: myState ? myState.metrics : null
  });
};

/**
 * Sends back the metrics of all *other* windows (excluding the requester).
 */
const getOtherMetrics = (msg, port) => {
  const others = Object.keys(state)
    .filter(id => id !== msg.id)
    .map(id => ({
      id: id,
      metrics: state[id].metrics
    }));

  port.postMessage({
    type: 'otherMetrics',
    data: others
  });
};

/**
 * Called whenever a new window connects to the SharedWorker.
 */
onconnect = function (e) {
  const port = e.ports[0];
  connections.push(port);

  port.onmessage = function (event) {
    const msg = event.data;

    switch (msg.type) {
      case 'metrics':
        updateMetrics(msg, port);
        break;

      case 'getMyMetrics':
        getMyMetrics(msg, port);
        break;

      case 'getOtherMetrics':
        getOtherMetrics(msg, port);
        break;

      default:
        console.warn('Unknown message type:', msg.type);
    }
  };

  port.start();
};
