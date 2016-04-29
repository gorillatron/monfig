
/**
 * Import
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.build = build;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodashObjectMerge = require('lodash/object/merge');

var _lodashObjectMerge2 = _interopRequireDefault(_lodashObjectMerge);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var monfigLogPrompt = '[' + "monfig".green + ']';
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
  var options = arguments.length <= 0 || arguments[0] === undefined ? { env: 'development', basePath: './config', debug: false } : arguments[0];

  var _ref, _ref2, baseConfig, envConfig, localConfig, config;

  return regeneratorRuntime.async(function build$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        options.debug && console.info(monfigLogPrompt + ' ' + 'starting build on basePath:'.gray + ' ' + options.basePath);

        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_bluebird2['default'].all([buildBaseConfig(options), buildEnvConfig(options), buildLocalConfig(options)]));

      case 3:
        _ref = context$1$0.sent;
        _ref2 = _slicedToArray(_ref, 3);
        baseConfig = _ref2[0];
        envConfig = _ref2[1];
        localConfig = _ref2[2];
        config = (0, _lodashObjectMerge2['default'])(baseConfig, envConfig, localConfig);

        if (options.debug) {
          console.info(monfigLogPrompt + ' ' + 'built config:'.gray);
          console.info(config);
        }

        return context$1$0.abrupt('return', config);

      case 11:
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
  var configFiles, configs;
  return regeneratorRuntime.async(function buildBaseConfig$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return regeneratorRuntime.awrap(afs.readdirAsync(options.basePath));

      case 2:
        context$1$0.t0 = filterNonBaseConfigFiles;
        configFiles = context$1$0.sent.filter(context$1$0.t0);
        context$1$0.next = 6;
        return regeneratorRuntime.awrap(_bluebird2['default'].reduce(configFiles, function callee$1$0(configs, fileName) {
          var configKeyName, config;
          return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                configKeyName = fileName.replace('.js', '');
                context$2$0.next = 3;
                return regeneratorRuntime.awrap(requireConfig(_path2['default'].join(options.basePath, fileName), options));

              case 3:
                config = context$2$0.sent;
                return context$2$0.abrupt('return', _extends({}, configs, _defineProperty({}, configKeyName, config)));

              case 5:
              case 'end':
                return context$2$0.stop();
            }
          }, null, this);
        }, {}));

      case 6:
        configs = context$1$0.sent;
        return context$1$0.abrupt('return', configs);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
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
        return context$1$0.abrupt('return', requireConfig(_path2['default'].join(options.basePath, '/env/', options.env + '.js'), options));

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
        return context$1$0.abrupt('return', requireConfig(_path2['default'].join(options.basePath, 'locals.js'), options));

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
function requireConfig(configPath, options) {
  var configFactory, config;
  return regeneratorRuntime.async(function requireConfig$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;

        options.debug && console.info(monfigLogPrompt + ' ' + 'require config:'.gray + ' ' + configPath);

        configFactory = require(configPath);

        if (typeof configFactory === 'object') {
          configFactory = configFactory['default'] || configFactory.factory;
        }

        if (!(typeof configFactory !== 'function')) {
          context$1$0.next = 7;
          break;
        }

        options.debug && warnInvalidConfigFactory(configPath);
        return context$1$0.abrupt('return', {});

      case 7:
        context$1$0.next = 9;
        return regeneratorRuntime.awrap(configFactory());

      case 9:
        config = context$1$0.sent;
        return context$1$0.abrupt('return', config);

      case 13:
        context$1$0.prev = 13;
        context$1$0.t0 = context$1$0['catch'](0);

        options.debug && warnConfigFactoryException(context$1$0.t0, configPath);
        return context$1$0.abrupt('return', {});

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 13]]);
}

/**
 * Warn of invalid config
 * @private
 * @param configPath:String
 * @returns Void 0
*/
function warnInvalidConfigFactory(configPath) {
  console.warn('\n    ' + monfigLogPrompt + ' Invalid config factory at: ' + configPath + '\n    ' + monfigLogPrompt + ' Export either "default" or "factory" from config.\n    ' + monfigLogPrompt + ' Returning empty object\n  ');
}

/**
 * Warn of exception in config
 * @private
 * @param exception:Error
 * @param configPath:String
 * @returns Void 0
*/
function warnConfigFactoryException(exception, configPath) {
  console.warn('\n    ' + monfigLogPrompt + ' Invalid config factory at: ' + configPath + '\n    ' + monfigLogPrompt + ' Threw exception.\n    ' + monfigLogPrompt + ' Returning empty object.\n    ' + monfigLogPrompt + ' Logging exception:\n  ');
  console.error(exception);
}

/**
 * Filter non js files, folders and the local.js conf
 * @private
 * @param fileName:String
 * @returns Boolean
*/
function filterNonBaseConfigFiles(fileName) {
  return fileName[0] !== '.' && fileName[0] !== '..' && fileName.match('.js') && !fileName.match('locals');
}