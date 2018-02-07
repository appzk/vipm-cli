import React from 'react'
import PropTypes from 'prop-types'
import assign from 'lodash/assign'

const ReactShow = ({
  show,
  children,
  ...props
}) => {
  if (show) return React.Children.map(children, item => React.cloneElement(item, { ...props }))[0]
  return React.Children.map(children, item => React.cloneElement(item, {
    ...props,
    style: assign({}, item.props.style, {
      display: 'none'
    })
  }))[0]
}

ReactShow.defaultProps = {
  show: false
}

ReactShow.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.element.isRequired
}

export default ReactShow
