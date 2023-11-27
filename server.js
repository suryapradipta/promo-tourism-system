const http = require('http');

const app = require('./server/app');

const port = process.env.PORT || 3000;

app.set('port', port);

const server = http.createServer(app);

server.on('error', (error) => {
  console.error(`Server error: ${error.message}`);
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
