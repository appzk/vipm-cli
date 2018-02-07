import React from 'react'
import assign from 'lodash/assign'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'
import { display, opacity, transform } from '../style/adapt'

import './toast.styl'

const Toast = ({
  show,
  content = '服务器加载失败',
  classString = 'toast--default'
}) => {
  return (
    <Motion defaultStyle={{ x: 0 }} style={{ x: spring(show ? 100 : 0, { stiffness: 200 }) }}>
      {({ x }) =>
        <div className={`toast ${classString}`} style={assign(display(x), opacity(x), transform(x))}>{content}</div>
      }
    </Motion>
  )
}

Toast.propTypes = {
  show: PropTypes.bool.isRequired,
  content: PropTypes.string,
  classString: PropTypes.string
}

export default Toast
