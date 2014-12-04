var Router = require('express').Router();

// will have modes:
	//splitted
	// routefile
	// current default of API versioning



var app, config, db, fn, handlers, method, path, pluralize, pluralized, registerRoute, requireDir, resDir, resource, resources, winston,
  __slice = [].slice;

config = require('../config');

app = require('./express');

db = require('../database');

winston = require('winston');

pluralize = require('pluralize');

requireDir = require('require-dir');

path = require('path');

resDir = path.join(__dirname, '../resources');

resources = requireDir(resDir, {
  recurse: true
});

registerRoute = function() {
  var fns, method, route;
  method = arguments[0], route = arguments[1], fns = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  winston.log('info', "" + (method.toUpperCase()) + " " + route + " registered");
  app[method].apply(app, [route].concat(__slice.call(fns)));
  return app;
};

for (resource in resources) {
  handlers = resources[resource];
  for (method in handlers) {
    fn = handlers[method];
    if (!(typeof fn === "function")) {
      continue;
    }
    pluralized = pluralize.plural(resource);
    if (method === 'getAll') {
      registerRoute('get', "" + config.apiPrefix + "/" + pluralized, fn);
    } else if (method === 'post') {
      registerRoute(method, "" + config.apiPrefix + "/" + pluralized, fn);
    } else {
      registerRoute(method, "" + config.apiPrefix + "/" + pluralized + "/:id", fn);
    }
  }
}

module.exports = app;


    
