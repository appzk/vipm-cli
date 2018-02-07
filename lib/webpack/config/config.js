const path = require('path'),
  { cwd, getProjectName } = require('../../utils/pathHelper')

module.exports = {
  dev: {
    port: 8008,
    host: '0.0.0.0',
    devTool: true,
    isBuild: false,
    happyDebug: true,
    showConsole: true,
    outputPath: path.join(cwd(), 'dev'),
    spritePath: path.join(cwd(), 'dev/static/img'),
    outputPubPath: '/',
    definePlugin: {
      'LOCAL_ROOT': '"dev"',
      'process.env.NODE_ENV': '"development"'
    },
    proxy: {}
  },
  test: {
    devTool: true,
    isBuild: true,
    happyDebug: false,
    showConsole: true,
    outputPath: path.join(cwd(), 'build'),
    spritePath: path.join(cwd(), 'build/static/img'),
    outputPubPath: '/',
    definePlugin: {
      'LOCAL_ROOT': '"test"',
      'process.env.NODE_ENV': '"production"'
    }
    
  },
  prod: {
    isBuild: true,
    happyDebug: false,
    showConsole: false,
    outputPath: path.join(cwd(), 'release'),
    spritePath: path.join(cwd(), 'release/static/img'),
    outputPubPath: '/',
    definePlugin: {
      'LOCAL_ROOT': '"prod"',
      'process.env.NODE_ENV': '"production"'
    }
  },
  defaultVendor: ['vue', 'vuex', 'vue-router', 'vue-resource', 'es6-promise']
}
