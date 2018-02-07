const assign = require('lodash/assign')
const getLocalConfig = require('./lib/utils/getLocalConfig')
const { isReact, eslintConfig = {} } = getLocalConfig()
const { globals = {}, rules = {} } = eslintConfig

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module'
  },
  extends: [
    'standard'
  ].concat(isReact ? ['plugin:react/recommended'] : []),
  plugins: [
    'html'
  ].concat(isReact ? ['react'] : []),
  globals: assign(globals, {
    fetch: true,
    Headers: true,
    Request: true,
    FormData: true,
    LOCAL_ROOT: true,
    PUBLIC_PATH: true,
    FileReader: true,
    Image: true,
    Blob: true
  }),
  'rules': assign(rules, {
    'no-var': 2,
    'no-new': 0,
    'no-eval': 0,
    'indent': [2, 2],
    'arrow-parens': 0,
    'react/prop-types': [0],
    'generator-star-spacing': 0,
    'padded-blocks': [0, 'never'],
    'space-before-function-paren': [2, 'never'],
    'yield-star-spacing': [2, { before: false, after: true }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  })
}
