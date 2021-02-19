const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const router = require('./router/router.js');
const Ut = require('./utils.js')

const uniServer = (req, res) => {
  let parsedUrl = url.parse(req.url, true);

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

    let chosenHandler = typeof (router.routes[trimmedPath]) !== 'undefined' ? router.routes[trimmedPath] : router.handlers.notFound;

    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryObject,
      'method': method,
      'headers': headers,
      'body': Ut.parseJsonToObject(buffer),
    }

    chosenHandler(data, (statusCode, body) => {
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

      body = typeof (body) == 'object' ? body : {};

      const bodyString = JSON.stringify(body);

      res.setHeader('Content-type', 'application/json');
      res.writeHead(statusCode);

      res.end(bodyString);
    });
  });
};

const httpServer = http.createServer((req, res) => {
  uniServer(req, res);
});

const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = http.createServer(httpsServerOptions, (req, res) => {
  uniServer(req, res);
});



module.exports = {
  httpServer,
  httpsServer
};
