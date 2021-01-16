/*
*
* First API File
*
*/

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res)=>{

  let parsedUrl = url.parse(req.url,true);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryObject = parsedUrl.query;
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data',(data)=>{
    buffer += decoder.write(data);
  });

  req.on('end',()=>{
    buffer += decoder.end();

    res.end('Hello Bro\n');

    console.log(`\n-----------------------------
      \nRequest in: ${trimmedPath}\nMethod: ${method}\nQueryStringObject: `,queryObject);
    console.log('Request headers: ', headers);
    console.log('Payload: ', buffer);
  });
});

server.listen(3000,()=>{
  console.log('server in port 3000 ');
});
