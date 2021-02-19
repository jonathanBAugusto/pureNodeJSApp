const Config = require('./config.js');
const Server = require('./resources/server.js');

Server.httpServer.listen(Config.httpPort, () => {
  console.log(`server on port ${Config.httpPort}`);
});

Server.httpsServer.listen(Config.httpsPort, () => {
  console.log(`server on port ${Config.httpsPort}`);
});
