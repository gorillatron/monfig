
/**
 * Import
*/
import Promise  from 'bluebird';
import fs       from 'fs';
import path     from 'path';
import merge    from 'lodash/object/merge';


const afs = Promise.promisifyAll(fs)


/**
 * Build Server Config
 * @public
 * @async
 * @param options:Object
 * @param options.env:String
 * @returns Object
*/
export async function build( options = {env: 'development', basePath: '../config'}) {
  let [baseConfig, envConfig, localConfig] =
    await Promise.all([buildBaseConfig(options), buildEnvConfig(options), buildLocalConfig(options)])

  let config = merge(baseConfig, envConfig, localConfig)

  return Promise.resolve(config)
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
  let config = {}
  let error = null

  let configFiles = await afs.readdirAsync(options.basePath)

  configFiles = configFiles.filter(filterNonBaseConfigFiles)

  for(let fileName of configFiles) {
    try {

      let configFactory = require(path.join(options.basePath, fileName))
      config[fileName.replace('.js', '')] = await configFactory()

    }
    catch(exception) {
      error = exception
    }
  }

  return new Promise((resolve, reject) => {
    return error ? reject(error) :
                   resolve(config)
  })
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
  return requireConfig(path.join(options.basePath, '/env/', `${options.env}.js`))
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
  return requireConfig(path.join(options.basePath, 'locals.js'))
}


/**
 * Require a Config file
 * @private
 * @async
 * @param configPath:String - absolute path for config module
 * @returns Promise<Object>
*/
async function requireConfig(configPath) {
  try {
    let configFactory = require(configPath)
    let config = await configFactory()
    return config
  }
  catch(exception) {
    console.warn('no config at:', configPath)
    return {}
  }
}


/**
 * Filter non js files, folders and the local.js conf
 * @private
 * @param fileName:String
 * @returns Boolean
*/
function filterNonBaseConfigFiles(fileName) {
  return fileName[0] !== '.' && fileName.match('.js') && !fileName.match("locals")
}