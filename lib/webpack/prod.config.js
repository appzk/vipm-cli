const webpack = require('webpack'),
  assign = require('lodash/assign'),
  config = require('./config/config'),
  webpackMerge = require('webpack-merge'),
  ZipPlugin = require('zip-webpack-plugin'),
  webpackBaseConfig = require('./base.config'),
  getLocalConfig = require('../utils/getLocalConfig'),
  ProgressPlugin = require('webpack/lib/ProgressPlugin'),
  OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'),
  localConfig = getLocalConfig(),
  env = process.env.NODE_ENV,
  isZip = process.env.IS_ZIP

module.exports = webpackMerge(webpackBaseConfig, {
  devtool: config[env].devTool ? '#source-map' : config[env].devTool,
  output: {
    publicPath: localConfig.publicPath && localConfig.publicPath[env] !== undefined ? localConfig.publicPath[env] : config[env].outputPubPath,
  },
  plugins: [
    new ProgressPlugin(),
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
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ].concat(isZip === 'zip' ? [
    new ZipPlugin(assign({
      filename: 'app.zip'
    }, localConfig.zipConfig))
  ] : [])
})
