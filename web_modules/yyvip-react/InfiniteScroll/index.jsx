import React, { PureComponent} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { getDpr } from '../../yyvip-flexible/utils'
import { delayExec } from '../../yyvip-utils/utils'
import { getVisibleHeight, getScrollHeight, getScrollTop, getScrollEventTarget } from '../../yyvip-utils/checkBrowser'

export default class InfiniteScroll extends PureComponent {
  static defaultProps = {
    tag: 'div',
    isScroll: true,
    distance: 20 * getDpr(),
    styleClass: 'infinite-scroll-default'
  }

  constructor(...args) {
    super(...args)
    this.element = null
    this.onScroll = null
    this.scrollRef = null
  }

  componentDidMount() {
    const { loading, isScroll, distance, onLoadMore } = this.props
    this.element = getScrollEventTarget(this.scrollRef)
    this.onScroll = delayExec(() => {
      if (getScrollHeight(this.element) - getVisibleHeight(this.element) - getScrollTop(this.element) < distance && !loading && isScroll) {
        onLoadMore && onLoadMore(this.element)
      }
    }, 100)
    this.element.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    if (this.element && this.onScroll) this.element.removeEventListener('scroll', this.onScroll)
  }

  render() {
    const { styleClass, children } = this.props
    return <this.props.tag className={classnames('infinite-scroll', styleClass)} ref={(target) => { this.scrollRef = target }}>{children}</this.props.tag>
  }
}

InfiniteScroll.propTypes = {
  tag: PropTypes.string,
  loading: PropTypes.bool,
  children: PropTypes.node,
  isScroll: PropTypes.bool,
  distance: PropTypes.number,
  onLoadMore: PropTypes.func,
  styleClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
}
