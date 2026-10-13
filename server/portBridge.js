import http from 'http';
import net from 'net';

const TARGET_PORT = 5175;
const BRIDGE_PORT = 5173;

const server = http.createServer((req, res) => {
  const options = {
    hostname: 'localhost',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${TARGET_PORT}`
    }
  };

  const proxy = http.request(options, (targetRes) => {
    res.writeHead(targetRes.statusCode, targetRes.headers);
    targetRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`Bridge error forwarding to port ${TARGET_PORT}: ${err.message}`);
  });

  req.pipe(proxy, { end: true });
});

// Proxy WebSocket upgrade for Vite HMR
server.on('upgrade', (req, clientSocket, head) => {
  const targetSocket = net.connect(TARGET_PORT, 'localhost', () => {
    clientSocket.write('HTTP/1.1 101 Switching Protocols\r\n' +
      'Upgrade: websocket\r\n' +
      'Connection: Upgrade\r\n\r\n');
    targetSocket.pipe(clientSocket);
    clientSocket.pipe(targetSocket);
  });

  targetSocket.on('error', () => {
    clientSocket.destroy();
  });
  clientSocket.on('error', () => {
    targetSocket.destroy();
  });
});

server.listen(BRIDGE_PORT, '0.0.0.0', () => {
  console.log(`Port bridge listening on port ${BRIDGE_PORT} -> forwarding to port ${TARGET_PORT}`);
});
