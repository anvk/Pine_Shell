/*global require*/

var opengate = require('./pinegate');

var routes = [
  {
    url: '/address',
    shellCommand: 'ls'
  },
  {
    url: '/address/reload',
    shellCommand: 'ls -la',
    argMap: {
      customerid: 'params.customerid'
    }
  },
  {
    url: '/ping/:message',
    shellCommand: 'echo {{message}}',
    argMap: {
      message: 'params.message'
    }
  }
];

opengate({
  routes: routes,
  port: 3000
});