const http = require('http')
const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const { crossDomain } = require('./middlewares')
const defaultsDeep = require('lodash/defaultsDeep')
const { cwd, type, compileMockConfig } = require('./utils')

const mockConfigPath = cwd('mock.config.js')
const baseMockConfigPath = cwd('../mock.config.js')
const config = defaultsDeep({}, compileMockConfig(mockConfigPath), compileMockConfig(baseMockConfigPath))

if (type(config.apis) === 'object') {
  const app = express()
  app.enable('trust proxy')
  app.disable('x-powered-by')
  app.set('port', config.port || 8010)

  app.use(crossDomain)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(router(config))

  app.use((req, res, next) => {
    res.status(404).json({ status: 0, code: 404, msg: 'Not Found' })
  })

  app.use((err, req, res, next) => {
    res.status(500).json({ status: 0, code: 500, msg: 'Server Error' })
  })

  http.createServer(app).listen(app.get('port'), function() {
    console.log(`Mock Express server listening on port ${app.get('port')}`)
  })
}
