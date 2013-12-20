/*global require, module*/

var express = require('express'),
    _ = require('lodash-node'),
    extend = require('node.extend'),
    exec = require('child_process').exec;

var app = express();
app.use(express.bodyParser());

var opengate = function(options) {
  var that = {};

  var defaults = {
    routes: [],
    port: 3000
  };

  var init = function(options) {
    options = extend(true, {}, defaults, options);

    generateRoutes(options.routes);

    app.listen(options.port);

    console.log('OpenGate has started on port ' + options.port + '...');
    return that;
  };

  var getEl = function(obj, path) {
    if (_.isEmpty(path) || !obj) {
      return;
    }
    path = path.split('.');
    var res = obj;
    for (var i = 0, len = path.length; i < len; i++) {
      var segment = res[path[i]];
      if (segment !== undefined) {
        res = segment;
      } else {
        return;
      }
    }
    return res;
  };

  var generateNewMapObject = function(obj, map) {
    map = map || {};
    obj = obj || {};
    var result = {};

    _.each(map, function(path, name) {
      result[name] = getEl(obj, path);
    });

    return result;
  };

  var generateRoutes = function(routes) {
    routes = routes || [];

    _.each(routes, function(route) {
      var method = route.method || 'get';

      app[method](route.url, function(req, res) {
        var args = generateNewMapObject(req, route.argMap);

        exec(route.shellCommand, function(error, stdout, stderr) {
          if (error) {
            console.log(error);
          }

          res.send(stdout);
        });
      });
    });
  };

  return init(options);
};

module.exports = opengate;