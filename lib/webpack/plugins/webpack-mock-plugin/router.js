const _ = require('lodash')
const express = require('express')
const Router = express.Router()
const { mockController } = require('./controllers')
const { jsonRes, delayRes, adaptParams, successRate } = require('./middlewares')

const resTypeConfig = {
  get: 'json',
  post: 'json',
  jsonp: 'jsonp'
}

const routerTypeConfig = {
  get: 'get',
  post: 'post',
  jsonp: 'get'
}

const mapMiddleWareRouterCreator = (mockController) => (apis) => {
  _.forEach(apis, (item, path) => {
    let { middlewares = [], timeout, type, rate } = item
    let resType = resTypeConfig[type]
    let routerType = routerTypeConfig[type]
    if (resType && routerType) {
      middlewares.unshift(adaptParams(routerType))
      if (rate) middlewares.unshift(successRate(rate))
      if (timeout) middlewares.unshift(delayRes(timeout))
      if (resType === 'json') middlewares.unshift(jsonRes)
      Router[routerType](path, ...middlewares, ...mockController(item, resType))
    }
  })
}

const mapConfig = (config) => {
  let result = {}
  _.forEach(config.apis, (item, key) => {
    result[key] = _.defaultsDeep({}, item, config.common)
  })
  return result
}

module.exports = function(config) {
  mapMiddleWareRouterCreator(mockController)(mapConfig(config))
  return Router
}
