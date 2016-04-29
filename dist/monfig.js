
/**
 * Import
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.build = build;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodashObjectMerge = require('lodash/object/merge');

var _lodashObjectMerge2 = _interopRequireDefault(_lodashObjectMerge);

var afs = _bluebird2['default'].promisifyAll(_fs2['default']);

/**
 * Build Server Config
 * @public
 * @async
 * @param options:Object
 * @param options.env:String
 * @returns Object
*/

function build() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? { env: 'development', basePath: '../config' } : arguments[0];

  var _ref, _ref2, baseConfig, envConfig, localConfig, config;

  return regeneratorRuntime.async(function build$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return regeneratorRuntime.awrap(_bluebird2['default'].all([buildBaseConfig(options), buildEnvConfig(options), buildLocalConfig(options)]));

      case 2:
        _ref = context$1$0.sent;
        _ref2 = _slicedToArray(_ref, 3);
        baseConfig = _ref2[0];
        envConfig = _ref2[1];
        localConfig = _ref2[2];
        config = (0, _lodashObjectMerge2['default'])(baseConfig, envConfig, localConfig);
        return context$1$0.abrupt('return', _bluebird2['default'].resolve(config));

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

/**
 * Build Server Base Config
 * @private
 * @async
 * @param options:Object
 * @param options.env:String
 * @returns Promise<Object>
*/
function buildBaseConfig(options) {
  var config, error, configFiles, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fileName, configFactory;

  return regeneratorRuntime.async(function buildBaseConfig$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        config = {};
        error = null;
        context$1$0.next = 4;
        return regeneratorRuntime.awrap(afs.readdirAsync(options.basePath));

      case 4:
        configFiles = context$1$0.sent;

        configFiles = configFiles.filter(filterNonBaseConfigFiles);

        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 9;
        _iterator = configFiles[Symbol.iterator]();

      case 11:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          context$1$0.next = 26;
          break;
        }

        fileName = _step.value;
        context$1$0.prev = 13;
        configFactory = require(_path2['default'].join(options.basePath, fileName));
        context$1$0.next = 17;
        return regeneratorRuntime.awrap(configFactory());

      case 17:
        config[fileName.replace('.js', '')] = context$1$0.sent;
        context$1$0.next = 23;
        break;

      case 20:
        context$1$0.prev = 20;
        context$1$0.t0 = context$1$0['catch'](13);

        error = context$1$0.t0;

      case 23:
        _iteratorNormalCompletion = true;
        context$1$0.next = 11;
        break;

      case 26:
        context$1$0.next = 32;
        break;

      case 28:
        context$1$0.prev = 28;
        context$1$0.t1 = context$1$0['catch'](9);
        _didIteratorError = true;
        _iteratorError = context$1$0.t1;

      case 32:
        context$1$0.prev = 32;
        context$1$0.prev = 33;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 35:
        context$1$0.prev = 35;

        if (!_didIteratorError) {
          context$1$0.next = 38;
          break;
        }

        throw _iteratorError;

      case 38:
        return context$1$0.finish(35);

      case 39:
        return context$1$0.finish(32);

      case 40:
        return context$1$0.abrupt('return', new _bluebird2['default'](function (resolve, reject) {
          return error ? reject(error) : resolve(config);
        }));

      case 41:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[9, 28, 32, 40], [13, 20], [33,, 35, 39]]);
}

/**
 * Build Server Environment Config
 * @private
 * @async
 * @param options:Object
 * @param options.env:String
 * @returns Promise<Object>
*/
function buildEnvConfig(options) {
  return regeneratorRuntime.async(function buildEnvConfig$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.abrupt('return', requireConfig(_path2['default'].join(options.basePath, '/env/', options.env + '.js')));

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

/**
 * Build Server Local Config
 * @private
 * @async
 * @param options:Object
 * @param options.env:String
 * @returns Promise<Object>
*/
function buildLocalConfig(options) {
  return regeneratorRuntime.async(function buildLocalConfig$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.abrupt('return', requireConfig(_path2['default'].join(options.basePath, 'locals.js')));

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

/**
 * Require a Config file
 * @private
 * @async
 * @param configPath:String - absolute path for config module
 * @returns Promise<Object>
*/
function requireConfig(configPath) {
  var configFactory, config;
  return regeneratorRuntime.async(function requireConfig$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        configFactory = require(configPath);

        if (typeof configFactory === "object") {
          configFactory = configFactory['default'] || configFactory.factory;
        }

        if (typeof configFactory !== "function") {
          console.warn("export from config factory not function");
          console.warn("config: " + configPath);
          console.warn("export either 'default' or 'factory'");
        }

        context$1$0.next = 6;
        return regeneratorRuntime.awrap(configFactory());

      case 6:
        config = context$1$0.sent;
        return context$1$0.abrupt('return', config);

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0['catch'](0);

        console.warn('no config at:', configPath);
        return context$1$0.abrupt('return', {});

      case 14:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 10]]);
}

/**
 * Filter non js files, folders and the local.js conf
 * @private
 * @param fileName:String
 * @returns Boolean
*/
function filterNonBaseConfigFiles(fileName) {
  return fileName[0] !== '.' && fileName.match('.js') && !fileName.match("locals");
}
