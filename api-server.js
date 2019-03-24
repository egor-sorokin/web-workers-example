const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const ip_addr = '127.0.0.1';
const port = '8888';

var server = restify.createServer();

server.use(require('restify-plugins').queryParser());

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*']
});

server.pre(cors.preflight);
server.use(cors.actual);

var PATH = '/data';
server.get({path: PATH}, getDeviceReading);

const dataSet = [
  {
    name: 'aws_x',
    unit: 's1',
  },
  {
    name: 'aws_y',
    unit: 's2',
  },
  {
    name: 'aws_z',
    unit: 's3',
  },
  {
    name: 'aws_alpha',
    unit: 'deg1',
  },
  {
    name: 'aws_beta',
    unit: 'deg2',
  },
  {
    name: 'aws_gamma',
    unit: 'deg3',
  }
];

function getDeviceReading(req, res, next) {
  const timeout = Math.floor(Math.random() * 5000);
  setTimeout(() => {
    res.send(200, {
      data: dataSet
    });
  }, timeout);
}


server.listen(port, ip_addr, function () {
  console.log('%s listening at %s ', server.name, server.url);
});

