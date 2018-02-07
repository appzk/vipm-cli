const path = require('path'),
  webpack = require('webpack'),
  config = require('./config/config'),
  getType = require('../utils/getType'),
  defaultsDeep = require('lodash/defaultsDeep'),
  getLocalConfig = require('../utils/getLocalConfig'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  AssetsWebpackPlugin = require('assets-webpack-plugin')

const { cwd, ownDir } = require('../utils/pathHelper'),
  env = process.env.NODE_ENV

let publicPath,
  localConfig = getLocalConfig(),
  entries = initEntries(localConfig.vendor, localConfig.dllVendor),
  resolveModules = [cwd(), cwd('node_modules'), ownDir('node_modules'), ownDir('web_modules')]

if (process.env.CMD_ENV === 'dev') {
  publicPath = '/'
} else if (localConfig.publicPath && localConfig.publicPath[env] !== undefined) {
  publicPath = localConfig.publicPath[env]
} else {
  publicPath = config[env].outputPubPath
}

function initEntries(vendor, dllVendor) {
  if (!dllVendor) throw new Error('dllVendor is false, you can not use dll plugin.')
  if (vendor === false) throw new Error('vendor is false, you can not use dll plugin.')
  let entries = {},
    vendorType = getType(vendor)
  if (vendorType === 'object') throw new Error('vendor is an object, you can not use dll plugin.')
  if (vendorType === 'array' && vendor.length) {
    entries.vendor = vendor
  } else if (vendor !== false) {
    entries.vendor = config.defaultVendor
  }
  return entries
}

module.exports = {
  entry: entries,
  output: {
    publicPath,
    library: '[name]_lib',
    path: config[env].outputPath,
    filename: 'dll/[name].[hash:5].dll.js',
  },
  resolve: {
    modules: resolveModules,
    extensions: ['.js', '.jsx', '.vue', '.css', 'scss', 'sass', 'styl'],
    alias: defaultsDeep(localConfig.alias, {
      'vue$': 'vue/dist/vue.esm.js'
    })
  },
  devtool: config[env].isBuild ? '#source-map' : '#cheap-module-eval-source-map',
  plugins: [
    new CleanWebpackPlugin([path.resolve(config[env].outputPath, 'dll')], { root: cwd() }),
    new webpack.DllPlugin({
      context: cwd(),
      name: '[name]_lib',
      path: path.join(config[env].outputPath, 'dll-manifest.json')
    }),
    new AssetsWebpackPlugin({
      filename: 'dll-config.json',
      path: config[env].outputPath
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compressor: {
        unused: true,
        evaluate: true,
        warnings: false,
        sequences: true,
        dead_code: true,
        if_return: true,
        join_vars: true,
        comparisons: true,
        conditionals: true
      },
      output: {
        comments: false
      }
    })
  ]
}
