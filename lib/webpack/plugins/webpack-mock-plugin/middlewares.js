const jsonRes = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
}

const crossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  next()
}

const delayRes = (time) => (req, res, next) => {
  setTimeout(function() { next() }, time)
}

const adaptParams = (type) => (req, res, next) => {
  const { body, method, query } = req
  if (method.toLowerCase() === 'get') {
    req.reqBody = query
  } else if (method.toLowerCase() === 'post') {
    req.reqBody = body
  } else {
    req.reqBody = {}
  }
  next()
}

const successRate = (rate) => (req, res, next) => {
  if (rate > Math.random()) return next()
  return next(500)
}

exports.jsonRes = jsonRes
exports.delayRes = delayRes
exports.adaptParams = adaptParams
exports.crossDomain = crossDomain
exports.successRate = successRate
