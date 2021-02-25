import { createServer } from 'http';
import https from 'https';
import { parse } from 'url';
import { StringDecoder } from 'string_decoder';
import { readFileSync } from 'fs';
import { routes, handlers } from './router/router.js';
import { parseJsonToObject } from './utils.js';

const uniServer = (req, res) => {
  let parsedUrl = parse(req.url, true);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryObject = parsedUrl.query;
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    let chosenHandler = typeof (routes[trimmedPath]) !== 'undefined' ? routes[trimmedPath] : handlers.withoutEndpoint;

    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryObject,
      'method': method,
      'headers': headers,
      'body': parseJsonToObject(buffer),
    }

    chosenHandler(data, (statusCode, body) => {
      res.setHeader('Content-type', 'application/json');
      res.writeHead(statusCode);

      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

      body = typeof (body) == 'object' ? body : {};

      const bodyString = JSON.stringify(body);

      res.end(bodyString);
    });
  });
};

const httpServer = createServer((req, res) => {
  uniServer(req, res);
});

const httpsServerOptions = {
  'key': readFileSync('./https/key.pem'),
  'cert': readFileSync('./https/cert.pem')
};

const httpsServer = createServer(httpsServerOptions, (req, res) => {
  uniServer(req, res);
});



export default {
  httpServer,
  httpsServer
};

export {
  httpServer,
  httpsServer,
};
