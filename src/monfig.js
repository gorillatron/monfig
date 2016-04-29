
/**
 * Import
*/
import Promise  from 'bluebird'
import fs       from 'fs'
import path     from 'path'
import merge    from 'lodash/object/merge'
import colors    from 'colors'


const monfigLogPrompt = `[${("monfig").green}]`
const afs = Promise.promisifyAll(fs)


/**
 * Build Server Config
 * @public
 * @async
 * @param options:Object
 * @param options.env:String
 * @returns Object
*/
export async function build(options = {env: 'development', basePath: './config', debug: false}) {
  options.debug && console.info(`${monfigLogPrompt} ${'starting build on basePath:'.gray} ${options.basePath}`)

  let [baseConfig, envConfig, localConfig] =
    await Promise.all([buildBaseConfig(options), buildEnvConfig(options), buildLocalConfig(options)])

  let config = merge(baseConfig, envConfig, localConfig)

  if(options.debug) {
    console.info(`${monfigLogPrompt} ${'built config:'.gray}`)
    console.info(config)
  }

  return config
}


/**
 * Build Server Base Config
 * @private
 * @async
 * @param options:Object
 * @param options.env:String
 * @returns Promise<Object>
*/
async function buildBaseConfig(options) {
  const configFiles =
    (await afs.readdirAsync(options.basePath))
    .filter(filterNonBaseConfigFiles)

  const configs = await Promise.reduce(configFiles,
    async function(configs, fileName) {

      var configKeyName = fileName.replace('.js', '')
      var config = await requireConfig(path.join(options.basePath, fileName), options)

      return {
        ...configs,
        [configKeyName]: config}

    }, {})

  return configs
}


/**
 * Build Server Environment Config
 * @private
 * @async
 * @param options:Object
 * @param options.env:String
 * @returns Promise<Object>
*/
async function buildEnvConfig(options) {
  return requireConfig(path.join(options.basePath, '/env/', `${options.env}.js`), options)
}


/**
 * Build Server Local Config
 * @private
 * @async
 * @param options:Object
 * @param options.env:String
 * @returns Promise<Object>
*/
async function buildLocalConfig(options) {
  return requireConfig(path.join(options.basePath, 'locals.js'), options)
}


/**
 * Require a Config file
 * @private
 * @async
 * @param configPath:String - absolute path for config module
 * @returns Promise<Object>
*/
async function requireConfig(configPath, options) {
  try {

    options.debug && console.info(`${monfigLogPrompt} ${'require config:'.gray} ${configPath}`)

    let configFactory = require(configPath)

    if(typeof configFactory === 'object') {
      configFactory = configFactory.default || configFactory.factory
    }

    if(typeof configFactory !== 'function') {
      options.debug && warnInvalidConfigFactory(configPath)
      return {}
    }

    let config = await configFactory()
    return config

  }
  catch(exception) {
    options.debug && warnConfigFactoryException(exception, configPath)
    return {}
  }
}

/**
 * Warn of invalid config
 * @private
 * @param configPath:String
 * @returns Void 0
*/
function warnInvalidConfigFactory(configPath) {
  console.warn(`
    ${monfigLogPrompt} Invalid config factory at: ${configPath}
    ${monfigLogPrompt} Export either "default" or "factory" from config.
    ${monfigLogPrompt} Returning empty object
  `)
}


/**
 * Warn of exception in config
 * @private
 * @param exception:Error
 * @param configPath:String
 * @returns Void 0
*/
function warnConfigFactoryException(exception, configPath) {
  console.warn(`
    ${monfigLogPrompt} Invalid config factory at: ${configPath}
    ${monfigLogPrompt} Threw exception.
    ${monfigLogPrompt} Returning empty object.
    ${monfigLogPrompt} Logging exception:
  `)
  console.error(exception)
}

/**
 * Filter non js files, folders and the local.js conf
 * @private
 * @param fileName:String
 * @returns Boolean
*/
function filterNonBaseConfigFiles(fileName) {
  return fileName[0] !== '.' &&
         fileName[0] !== '..' &&
         fileName.match('.js') &&
         !fileName.match('locals')
}
