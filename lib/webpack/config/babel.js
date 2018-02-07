const config = require('./config'),
  { ownDir } = require('../../utils/pathHelper'),
  getLocalConfig = require('../../utils/getLocalConfig'),
  isReact = getLocalConfig().isReact,
  env = process.env.NODE_ENV

const babel = {
  // filename will tell babel-core the file path, it is important
  filename: ownDir('lib/webpack/config/babel.js'),
  sourceMaps: config[env].isBuild ? false : 'inline',
  cacheDirectory: !config[env].isBuild,
  comments: true,
  presets: [
    [
      'es2015', {
        modules: false
      }
    ],
    'stage-2',
  ].concat(isReact ? ['react'] : []),
  plugins: [
    'transform-runtime',
    'transform-decorators-legacy'
  ].concat(isReact ? [
    ['import', { libraryName: 'antd', style: true }]
  ] : ['transform-vue-jsx']),
  env: {
    dev: {
      presets: [],
      plugins: []
    },
    test: {
      presets: [],
      plugins: []
    },
    prod: {
      presets: [],
      plugins: []
    }
  }
}

module.exports = babel
