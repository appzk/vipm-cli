const { mock } = require('mockjs')
const { type, findOneWithQuery } = require('./utils')

exports.mockController = (item, resType) => ([(req, res, next) => {
  const { reqBody } = req
  const { paramRes } = item
  if (type(paramRes) === 'array' && type(reqBody) === 'object') {
    const resItem = findOneWithQuery(paramRes, reqBody)
    if (resItem && resItem.res) return res.status(200)[resType](mock(resItem.res))
  }
  next()
}, (req, res, next) => {
  if (item.res) return res.status(200)[resType](mock(item.res))
  next()
}])
