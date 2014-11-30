var _ = require('lodash'),
	async = require('async') ;

module.exports = exports = function(schema, options){
	// take Model level options 

    schema.statics.pagedFind = function(params, cb){
		// Make it exist directly on Schema/Model rather than instances
		var _schema = this; // self-reference


		if (!options.filters) {
      options.filters = {};
    }

    if (!options.keys) {
      options.keys = '';
    }

    if (!options.limit) {
      options.limit = 20;
    }

    if (!options.page) {
      options.page = 1;
    }

    if (!options.sort) {
      options.sort = {};
    }

    var output = {
      data: null,
      pages: {
        current: options.page,
        prev: 0,
        hasPrev: false,
        next: 0,
        hasNext: false,
        total: 0
      },
      items: {
        begin: ((options.page * options.limit) - options.limit) + 1,
        end: options.page * options.limit,
        total: 0
      }
    };

    var countResults = function(callback) {
      thisSchema.count(options.filters, function(err, count) {
        output.items.total = count;
        callback(null, 'done counting');
      });
    };

    var getResults = function(callback) {
      var query = thisSchema.find(options.filters, options.keys);
      query.skip((options.page - 1) * options.limit);
      query.limit(options.limit);
      query.sort(options.sort);
      query.exec(function(err, results) {
        output.data = results;
        callback(null, 'done getting records');
      });
    };

    require('async').parallel([
      countResults,
      getResults
    ],
    function(err, results){
      if (err) {
        cb(err, null);
      }

      //final paging math
      output.pages.total = Math.ceil(output.items.total / options.limit);
      output.pages.next = ((output.pages.current + 1) > output.pages.total ? 0 : output.pages.current + 1);
      output.pages.hasNext = (output.pages.next !== 0);
      output.pages.prev = output.pages.current - 1;
      output.pages.hasPrev = (output.pages.prev !== 0);
      if (output.items.end > output.items.total) {
        output.items.end = output.items.total;
      }

      cb(null, output);
    });

	}
}

/*
var _ = require('underscore');
var async = require('async');

function findPaginated(filter, opts, cb) {
  var defaults = {skip : 0, limit : 10};
  opts = _.extend({}, defaults, opts);

  filter = _.extend({}, filter);

  var cntQry = this.find(filter);
  var qry = this.find(filter);

  if (opts.sort) {
    qry = qry.sort(opts.sort);
  }
  if (opts.fields) {
    qry = qry.select(opts.fields);
  }

  qry = qry.limit(opts.limit).skip(opts.skip);

  async.parallel(
    [
      function (cb) {
        cntQry.count(cb);
      },
      function (cb) {
        qry.exec(cb);
      }
    ],
    function (err, results) {
      if (err) return cb(err);
      var count = 0, ret = [];

      _.each(results, function (r) {
        if (typeof(r) == 'number') {
          count = r;
        } else if (typeof(r) != 'number') {
          ret = r;
        }
      });

      cb(null, {totalCount : count, results : ret});
    }
  );

  return qry;
}
 */