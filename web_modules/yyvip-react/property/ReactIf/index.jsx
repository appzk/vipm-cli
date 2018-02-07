import React from 'react'
import PropTypes from 'prop-types'

const ReactIf = ({
  show,
  children,
  ...props
}) => {
  if (show) return React.Children.map(children, item => React.cloneElement(item, { ...props }))[0]
  return null
}

ReactIf.defaultProps = {
  show: false
}

ReactIf.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.element.isRequired
}

export default ReactIf
