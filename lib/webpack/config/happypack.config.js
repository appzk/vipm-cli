const config = require('./config'),
  HappyPack = require('happypack'),
  happyThreadPool = HappyPack.ThreadPool({ size: 8 }),
  env = process.env.NODE_ENV

module.exports = function(id, loaders) {
  return new HappyPack({
    id: id,
    cacheContext: { env },
    cache: !config[env].isBuild,
    threadPool: happyThreadPool,
    debug: config[env].happyDebug,
    loaders: loaders
  })
}
