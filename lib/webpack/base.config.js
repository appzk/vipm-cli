const fs = require('fs'),
  os = require('os'),
  path = require('path'),
  glob = require('glob'),
  webpack = require('webpack'),
  forEach = require('lodash/forEach'),
  config = require('./config/config'),
  getType = require('../utils/getType'),
  babelConfig = require('./config/babel'),
  defaultsDeep = require('lodash/defaultsDeep'),
  happypack = require('./config/happypack.config'),
  getLocalConfig = require('../utils/getLocalConfig'),
  existEntryTemplate = require('../utils/existEntryTemplate'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'),
  WebpackDoneLogPlugin = require('./plugins/WebpackDoneLogPlugin'),
  dllHtmlWebpackPlugin = require('./plugins/dllHtmlWebpackPlugin'),
  ConsoleLogToolPlugin = require('./plugins/ConsoleLogToolPlugin'),
  HtmlWebpackHmtTrackPlugin = require('./plugins/HtmlWebpackHmtTrackPlugin'),
  HtmlWebpackMoveSrcToHeadPlugin = require('./plugins/HtmlWebpackMoveSrcToHeadPlugin')

const { cwd, ownDir } = require('../utils/pathHelper'),
  env = process.env.NODE_ENV

let htmlNames = [],
  htmlPlugin = [],
  dllHtmlWebpackPluginkeys = [],
  localConfig = getLocalConfig(),
  rules = localConfig.rules || [],
  vendorLocalConfig = localConfig.vendor,
  resolveDir = localConfig.resolveDir || [],
  { host = config.dev.host, port = config.dev.port } = localConfig
  resolveModules = [cwd(), cwd('node_modules'), ownDir('node_modules'), ownDir('web_modules')].concat(resolveDir),
  publicPath = localConfig.publicPath && localConfig.publicPath[env] !== undefined ? localConfig.publicPath[env] : config[env].outputPubPath,
  useDll = localConfig.dllVendor && fs.existsSync(path.join(config[env].outputPath), 'dll-config.json') && fs.existsSync(path.join(config[env].outputPath), 'dll-manifest.json'),
  dllHtmlOption = setDllHtmlOption(path.join(config[env].outputPath)),
  chunkConfig = setChunkConfig(vendorLocalConfig, localConfig.disableFlexible),
  favicon = localConfig.favicon ? path.resolve(cwd(), localConfig.favicon) : path.resolve(ownDir('web_modules'), 'yyvip-img/favicon.ico')
// set src/*.js as entries file, set root path files that has the same name as html
glob.sync(path.resolve(cwd(), './src/*.@(js|jsx|vue)')).forEach((filePath) => {
  const name = path.basename(filePath, path.extname(filePath)),
    htmlName = existEntryTemplate(cwd(), name)
  if (htmlName) {
    htmlNames.push(`${name}.html`)
    htmlPlugin.push(setHtmlPlugin(name, htmlName, favicon, config[env].outputPath))
  }
  chunkConfig.entries[name] = filePath
})

let webpackConfig = {
  profile: true,
  entry: chunkConfig.entries,
  output: {
    publicPath: '/',
    path: config[env].outputPath,
    filename: `js/[name]${localConfig.noHash ? '' : '.[hash:5]'}.js`,
    chunkFilename: 'js/[name].[hash:5].chunk.js'
  },
  cache: !config[env].isBuild,
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.css', 'scss', 'sass', 'styl'],
    modules: resolveModules,
    alias: defaultsDeep(localConfig.alias, {
      'vue$': 'vue/dist/vue.esm.js'
    })
  },
  resolveLoader: {
    modules: [cwd('node_modules'), ownDir('node_modules'), ownDir('lib/webpack/loaders')]
  },
  externals: defaultsDeep(localConfig.externals, {
    $: 'window.Zepto',
    _hmt: 'window._hmt',
    zepto: 'window.Zepto'
  }),
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.vue|\.jsx|\.js$/,
      include: [cwd('src'), ownDir('web_modules')].concat(resolveDir),
      exclude: [].concat(localConfig.eslintIgnoreDir || []),
      use: 'happypack/loader?id=eslint'
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      include: [cwd('src'), ownDir('web_modules')].concat(resolveDir),
      options: {
        loaders: defaultsDeep(localConfig.vueOptionsLoaders, {
          pug: [{
            loader: 'yyvip-pug-loader',
            options: {
              plugins: [ownDir('lib/webpack/plugins/pugBemify')]
            }
          }],
          css: getStyleLoaders(undefined, true),
          stylus: getStyleLoaders('stylus', true),
          scss: getStyleLoaders('sass', true),
          sass: getStyleLoaders('sass', true),
          less: getStyleLoaders('less', true),
          js: 'happypack/loader?id=js'
        }),
        cssModules: {
          camelCase: true,
          localIdentName: '[name]-[local]-[hash:base64:8]'
        }
      }
    }, {
      test: /\.jsx|\.js$/,
      include: [cwd(), ownDir('web_modules')].concat(resolveDir),
      loader: 'happypack/loader?id=js'
    }, {
      test: /\.pug/,
      use: [{
        loader: 'pug-loader',
        options: {
          plugins: [require(ownDir('lib/webpack/plugins/pugBemify'))()]
        }
      }]
    }, {
      test: /\.sass|\.scss$/,
      use: getStyleLoaders('sass'),
    }, {
      test: /\.css/,
      use: getStyleLoaders(),
    }, {
      test: /\.less$/,
      use: getStyleLoaders('less'),
    }, {
      test: /\.styl$/,
      use: getStyleLoaders('stylus'),
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.art$/,
      use: [{
        loader: 'yyvip-art-template-loader',
        options: {
          resolveModules: resolveModules
        }
      }]
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      use: (config[env].isBuild ? [{
        loader: 'image-cdn-loader',
        options: {
          cdnPath: localConfig.imageCdnPath
        }
      }] : []).concat([{
        loader: 'url-loader',
        options: {
          limit: 2048,
          name: `static/img/[name]${localConfig.noHash ? '' : '.[hash:5]'}.[ext]`
        }
      }]).concat(config[env].isBuild ? [{
        loader: 'image-webpack-loader',
        options: {
          pngquant: {
            speed: 4,
            quality: '75-90'
          },
          optipng: {
            optimizationLevel: 7
          },
          mozjpeg: {
            quality: 90,
            progressive: true
          },
          gifsicle: {
            interlaced: false
          }
        }
      }] : [])
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: `static/fonts/[name]${localConfig.noHash ? '' : '.[hash:5]'}.[ext]`
      }
    }].concat(rules)
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin(config[env].definePlugin),
    new webpack.DefinePlugin(defaultsDeep({ 'PUBLIC_PATH': JSON.stringify(publicPath) }, localConfig.defineData)),
    new webpack.ProvidePlugin({
      Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise/auto'
    }),
    new CleanWebpackPlugin([config[env].outputPath], {
      root: cwd(),
      exclude: ['dll', 'dll-config.json', 'dll-manifest.json']
    }),
    happypack('js', [{
      loader: 'babel-loader',
      query: defaultsDeep({}, localConfig.babel, babelConfig)
    }]),
    happypack('eslint', [{
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint-friendly-formatter'),
        configFile: ownDir('.eslintrc.js')
      }
    }]),
    new ExtractTextPlugin({
      filename: `css/[name]${localConfig.noHash ? '' : '.[hash:5]'}.css`,
      allChunks: true
    }),
    new webpack.LoaderOptionsPlugin({
      context: cwd(),
      debug: config[env].happyDebug,
      minimize: config[env].isBuild
    })
    // new BundleAnalyzerPlugin()
  ].concat(useDll ? [
    new webpack.DllReferencePlugin({
      context: cwd(),
      manifest: require(cwd(path.join(config[env].outputPath, 'dll-manifest.json')))
    })
  ] : []).concat(useDll && process.env.CMD_ENV === 'dev' ? [
    new CopyWebpackPlugin([{
      from: cwd(path.join(config[env].outputPath, 'dll')),
      to: cwd(path.join(config[env].outputPath, 'dll'))
    }])
  ] : []).concat(fs.existsSync(cwd('src/assets')) ? [
    new CopyWebpackPlugin([{
      from: cwd('src/assets'),
      to: 'assets'
    }])
  ] : []).concat(htmlPlugin)
}

function getStyleLoaders(name, useVueStyleLoader) {
  let loaders = [
    'css-loader?-autoprefixer&importLoaders=1',
    'postcss-loader?config=' + path.join(__dirname, 'config')
  ]
  name && loaders.push({
    loader: `${name}-loader`,
    options: name === 'sass' ? { data: `$scale: ${localConfig.scale || 1};` } : {}
  })
  let result = { use: loaders }
  useVueStyleLoader && (result.fallback = 'vue-style-loader')
  return ExtractTextPlugin.extract(result)
}

function setChunkConfig(vendor, disableFlexible) {
  const vendorType = getType(vendor)
  const result = {
    entries: {},
    recordImports: [],
    commonsChunk: {
      names: [],
      filename: `js/[name]${localConfig.noHash ? '' : '.[hash:5]'}.bundle.js`
    }
  }

  function pushNewMoudle(key, value) {
    result.entries[key] = value
    result.recordImports.push(key)
    result.commonsChunk.names.unshift(key)
  }

  if (!disableFlexible) pushNewMoudle('flexible', ['yyvip-flexible'])
  if (!useDll) {
    if (vendorType === 'array' && vendor.length) {
      pushNewMoudle('vendor', vendor)
    } else if (vendorType === 'object' && getType(vendor.chunks) === 'object' && getType(vendor.order) === 'array' && vendor.order.length) {
      forEach(vendor.order, key => {
        const value = vendor.chunks[key]
        if (getType(value) === 'array' && value.length) pushNewMoudle(key, value)
      })
    } else if (vendor !== false) {
      pushNewMoudle('vendor', config.defaultVendor)
    }
  } else {
    if (vendorType === 'object') throw new Error('vendor is an object, you can not use dll plugin.')
  }
  return result
}

function setDllHtmlOption(outputPath) {
  const config = {}
  if (useDll) {
    forEach(require(path.resolve(outputPath, 'dll-config.json')), (item, key) => {
      dllHtmlWebpackPluginkeys.push(item.js)
      config[`${key}DllBundleName`] = item.js
    })
  }
  return config
}

function setHtmlPlugin(name, htmlName, favicon, outputPath) {
  let config = defaultsDeep({}, localConfig.htmlOptions, {
    env,
    publicPath,
    filename: name + '.html',
    template: path.resolve(cwd(), htmlName),
    disableFlexible: localConfig.disableFlexible,
    hash: false,
    inject: true,
    chunks: [],
    chunksSortMode: 'dependency',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      collapseInlineTagWhitespace: true
    }
  }, dllHtmlOption)
  config.chunks.push(name)
  forEach(chunkConfig.recordImports, item => {
    if (getType(vendorLocalConfig) !== 'object' || getType(vendorLocalConfig.pagesExclude) !== 'object' || getType(vendorLocalConfig.pagesExclude[name]) !== 'array' || vendorLocalConfig.pagesExclude[name].indexOf(item) === -1) config.chunks.push(item)
  })
  favicon && (config.favicon = favicon)
  return new HtmlWebpackPlugin(config)
}

// add commonsChunk if needed
const headScripts = []
chunkConfig.recordImports.indexOf('flexible') !== -1 && headScripts.push('flexible')
forEach(chunkConfig.recordImports, item => {
  if (getType(vendorLocalConfig) === 'object' && getType(vendorLocalConfig.headInclude) === 'array' && vendorLocalConfig.headInclude.indexOf(item) !== -1) headScripts.push(item)
})
headScripts.length && webpackConfig.plugins.push(new HtmlWebpackMoveSrcToHeadPlugin(headScripts))
if (chunkConfig.commonsChunk.names.length) webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin(chunkConfig.commonsChunk))

// add HtmlWebpackHmtTrackPlugin if needed
let hmtKey
let hmtOnlyProduction = localConfig.hmtOnlyProduction !== false
if (localConfig.hmtKey !== false) {
  if (env === 'prod' || !hmtOnlyProduction) {
    hmtKey = localConfig.hmtKey || require('../command/package').hmtKey
  } else {
    hmtKey = false
  }
  webpackConfig.plugins.push(new HtmlWebpackHmtTrackPlugin(hmtKey))
}

if (config[env].showConsole && localConfig.showConsole) webpackConfig.plugins.push(new ConsoleLogToolPlugin())

if (useDll) webpackConfig.plugins.push(new dllHtmlWebpackPlugin({ keys: dllHtmlWebpackPluginkeys, env: process.env.CMD_ENV }))

if (!config[env].isBuild && process.env.CMD_ENV === 'dev') {
  let doneLog = '\nLocal root path is at below:\n'
  if (os.platform() === 'win32' && host === '0.0.0.0') host = 'localhost'
  const prefixLog =  `http://${host}:${port}/`
  htmlNames.forEach(item => { doneLog += `    ${prefixLog}${item}` })
  webpackConfig.plugins.push(new WebpackDoneLogPlugin(doneLog))
}

module.exports = webpackConfig
