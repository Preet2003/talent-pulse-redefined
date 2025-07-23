const http = require('http');

const PORT = 8000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server running!');
});

server.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
}); 