import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './touchSlide.styl'

const TouchSlide = ({ className, children }) => {
  return <div className={classnames('touch-slide', className)}>{children}</div>
}

TouchSlide.propTypes = {
  children: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
}

export default TouchSlide
