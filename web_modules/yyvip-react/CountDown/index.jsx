import React, { PureComponent} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './countDown.styl'

const noop = () => {}

export default class CountDown extends PureComponent {
  static defaultProps = {
    maxTime: 60,
    onStart: noop,
    onDisabled: noop,
    onNoneClickable: noop,
    activeText: '获取验证码',
    disabledText: '重新发送',
    styleClass: 'count-down--default'
  }

  constructor(...args) {
    super(...args)
    this.timer = null
    this.state = { time: 0, disabled: false }
    this.reset = this.reset.bind(this)
    this.bindClick = this.bindClick.bind(this)
  }

  bindClick(e) {
    e.stopPropagation()
    const { maxTime, onStart, clickable, onDisabled, onNoneClickable } = this.props
    if (!clickable) {
      onNoneClickable(e)
    } else if (this.state.disabled) {
      onDisabled(e)
    } else {
      onStart(e)
      this.setState({ disabled: true })
      this.timer = setInterval(() => {
        this.setState({ time: this.state.time + 1 }, () => this.state.time >= maxTime && this.reset())
      }, 1000)
    }
  }

  reset() {
    clearInterval(this.timer)
    this.setState({ time: 0, disabled: false })
  }

  render() {
    const {
      time,
      disabled
    } = this.state
    const {
      maxTime,
      styleClass,
      activeText,
      disabledText
    } = this.props
    return <div className={classnames('count-down', styleClass, { active: !disabled, disabled: disabled })} onClick={this.bindClick}>{disabled ? `${disabledText}(${maxTime - time}S)` : activeText}</div>
  }
}

CountDown.propTypes = {
  onStart: PropTypes.func,
  maxTime: PropTypes.number,
  activeText: PropTypes.string,
  onDisabled: PropTypes.func,
  disabledText: PropTypes.string,
  onNoneClickable: PropTypes.func,
  clickable: PropTypes.bool.isRequired,
  styleClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
}
