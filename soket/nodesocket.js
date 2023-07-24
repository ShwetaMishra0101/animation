const WebSocket = require('ws');

// WebSocket server
const wss = new WebSocket.Server({ port: 3000 });

console.log('WebSocket server listening on port 3000...');

// Connection event
wss.on('connection', (ws) => {
  console.log('WebSocket connection established');

  // Send JSON data infinitely
  const sendData = () => {
    const data = { name: 'random character' };
    ws.send(JSON.stringify(data));

    setTimeout(sendData, 1000);
  };

  sendData();
});

// Close event
wss.on('close', () => {
  console.log('WebSocket connection closed');
});
