/*global require*/

var pine = require('./pine'),
    _ = require('lodash-node'),
    exec = require('child_process').exec;

var successCode = 1,
    errorCode = 0;

var processRequest = function(params) {
  var res = params.res,
      shellCommand = params.route.shellCommand;

  _.each(params.args, function(value, key) {
    shellCommand = shellCommand.replace('{{' + key + '}}', value);
  });

  exec(shellCommand, function(error, stdout, stderr) {
    var result = {};

    if (error) {
      result.status = errorCode;
      console.log(error);
      if (stderr) {
        console.log(stderr);
        result.result = stderr;
      }
    } else {
      result.status = successCode;
      result.result = stdout;
    }

    res.send(result);
  });
};

var routes = [
  // GET http://localhost:3000/files/list
  {
    url: '/files/list',
    shellCommand: 'ls'
  },
  // GET http://localhost:3000/files/listDetails
  {
    url: '/files/listDetails',
    shellCommand: 'ls -la',
    argMap: {
      customerid: 'params.customerid'
    }
  },
  // GET http://localhost:3000/echo/HelloUser
  {
    url: '/echo/:message',
    shellCommand: 'echo {{message}}',
    argMap: {
      message: 'params.message'
    }
  }
];

pine({
  processRequest: processRequest,
  routes: routes,
  port: 3000,
  verbose: true
});