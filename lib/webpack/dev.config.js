const fs = require('fs'),
  path = require('path'),
  webpack = require('webpack'),
  config = require('./config/config'),
  getType = require('../utils/getType'),
  webpackMerge = require('webpack-merge'),
  webpackBaseConfig = require('./base.config'),
  defaultsDeep = require('lodash/defaultsDeep'),
  getLocalConfig = require('../utils/getLocalConfig'),
  WebpackMockPlugin = require('./plugins/webpack-mock-plugin'),
  FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'),
  { cwd, ownDir, getProjectName } = require('../utils/pathHelper'),
  { provide, provideWeb } = require('../utils/localServerUtils'),
  localServerPath = path.resolve(cwd('./local.server.js')),
  projectName = getProjectName(),
  env = process.env.NODE_ENV,
  serverEnv = process.env.SERVER_ENV,
  CONTENT_BASE = {
    dev: process.cwd(),
    test: path.resolve(process.cwd(), 'build'),
    prod: path.resolve(process.cwd(), 'release')
  }

let localServerInterface, setupFunction, injectFunction, hasDoLocalServerInject = false
let { openBrowser, proxy, historyApiFallback = true, watchOptions = {}, host = config.dev.host, port = config.dev.port } = getLocalConfig()
const dependencies = { env, serverEnv, projectName, cwd, cliDir: ownDir, provide, provideWeb, webpackConfig: webpackBaseConfig }

if (fs.existsSync(localServerPath)) {
  localServerInterface = require(localServerPath)
  setupFunction = localServerInterface.setup
  injectFunction = localServerInterface.inject
  if (!hasDoLocalServerInject && getType(injectFunction) === 'function') {
    hasDoLocalServerInject = true
    injectFunction(dependencies)
  }
}

module.exports = webpackMerge(webpackBaseConfig, {
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    host,
    port,
    disableHostCheck: true,
    contentBase: CONTENT_BASE[env],
    staticOptions: {
      redirect: false
    },
    quiet: true,
    noInfo: true,
    watchOptions,
    compress: true,
    open: openBrowser,
    historyApiFallback,
    proxy: defaultsDeep({}, proxy, config.dev.proxy),
    setup(app) {
      getType(setupFunction) === 'function' && setupFunction(app, dependencies)
      getType(localServerInterface) === 'function' && localServerInterface(app, dependencies)
    }
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ].concat(serverEnv === 'dev' ? [
    new WebpackMockPlugin()
  ] : [])
})
