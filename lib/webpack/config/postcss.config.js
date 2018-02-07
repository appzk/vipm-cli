const path = require('path'),
  precss = require('precss'),
  config = require('./config'),
  px2rem = require('postcss-px2rem'),
  autoprefixer = require('autoprefixer'),
  postcssSprites = require('postcss-sprites'),
  postcssSpx = require('../plugins/postcss-spx'),
  getLocal = require('../../utils/getLocalConfig'),
  { cwd, ownDir } = require('../../utils/pathHelper')

const defaultScale = filename => 1
const getRootDir = styleFilePath => styleFilePath.indexOf(ownDir()) !== -1 ? ownDir() : cwd()

let env = process.env.NODE_ENV,
  { autoPrefixList, remUnit = 75, spritesRem = 75, spritesScale = true, onSpx, mapScale = defaultScale, onSpritesScale } = getLocal()

function calSpritesStyle(num, image) {
  let pxNum
  const { styleFilePath } = image
  if (onSpritesScale) {
    pxNum = onSpritesScale(image)
  } else if (spritesScale) {
    pxNum = mapScale(styleFilePath) * num
  } else {
    pxNum = num
  }
  if (spritesRem) return `${parseFloat((pxNum/spritesRem).toFixed(6))}rem`
  return `${Math.round(pxNum)}px`
}

let spriteOpts = {
  retina: true,
  basePath: './',
  spritesmith: { padding: 4 },
  spritePath: config[env].spritePath,
  filterBy: function(image) {
    if (image.url.indexOf('img/sprites/') !== -1) {
      return Promise.resolve()
    }
    return Promise.reject()
  },
  groupBy: function(image) {
    const { styleFilePath } = image
    const relativeList = path.relative(getRootDir(styleFilePath), path.dirname(styleFilePath)).split(path.sep)
    while (relativeList.length > 2) {
      relativeList.shift()
    }
    if (relativeList.join('.')) return Promise.resolve(`${relativeList.join('.')}.${path.basename(styleFilePath, path.extname(styleFilePath))}`)
    return Promise.resolve(path.basename(styleFilePath, path.extname(styleFilePath)))
  },
  hooks: {
    onUpdateRule: function(rule, token, image) {
      const { ratio, coords, spriteUrl, spriteWidth, spriteHeight } = image
      const posX = calSpritesStyle(-1 * Math.abs(coords.x / ratio), image)
      const posY = calSpritesStyle(-1 * Math.abs(coords.y / ratio), image)
      const sizeX = calSpritesStyle(spriteWidth / ratio, image)
      const sizeY = calSpritesStyle(spriteHeight / ratio, image)
      token.cloneAfter({
        type: 'decl',
        prop: 'background-image',
        value: `url(${spriteUrl})`
      }).cloneAfter({
        prop: 'background-position',
        value: `${posX} ${posY}`
      }).cloneAfter({
        prop: 'background-size',
        value: `${sizeX} ${sizeY}`
      }).cloneAfter({
        prop: 'background-repeat',
        value: 'no-repeat'
      })
    }
  }
}

let plugins = [
  precss(),
  postcssSprites(spriteOpts),
  autoprefixer({ browsers: autoPrefixList || ['last 2 versions', 'iOS >= 7', 'Android >= 4.0'] }),
  postcssSpx({ onSpx, mapScale })
]
remUnit && plugins.push(px2rem({ remUnit }))

module.exports = { plugins }
