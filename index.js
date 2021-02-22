import Config from './config.js';
import { httpServer, httpsServer } from './resources/server.js';

httpServer.listen(Config.httpPort, () => {
  console.log(`server on port ${Config.httpPort}`);
});

httpsServer.listen(Config.httpsPort, () => {
  console.log(`server on port ${Config.httpsPort}`);
});
