import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import BottomLayer from '../BottomLayer'
import ReactIf from '../property/ReactIf'

import './bottomSelect.styl'

function getDisplayValue(input) {
  return typeof input !== 'object' ? input : (input.displayValue || input.text || input.value || input.val)
}

const BottomSelect = ({
  showCancle = true, cancelText = '取消', activeIndex, selectItems, onClickItem, onClickCancel, hideOnClickItem = true, hideOnClickCancel = true, hideBottomLayer, bottomSelectClass = 'bottom-select--default', children, ...props
}) => {
  const bindClickItem = (e, index) => {
    e.stopPropagation()
    onClickItem && onClickItem(e, index)
    hideOnClickItem && hideBottomLayer && hideBottomLayer(e)
  }
  const bindClickCancel = (e) => {
    e.stopPropagation()
    onClickCancel && onClickCancel(e)
    hideOnClickCancel && hideBottomLayer && hideBottomLayer(e)
  }
  return (
    <BottomLayer hideBottomLayer={hideBottomLayer} {...props}>
      <div className={classnames('bottom-select', bottomSelectClass)}>
        {children}
        <ul className='bottom-select__box'>
          {
            selectItems.map((item, index) => (
              <li key={getDisplayValue(item)} className={classnames('bottom-select__box__item', { active: index === activeIndex })} onClick={(e) => bindClickItem(e, index)}>{getDisplayValue(item)}</li>
            ))
          }
        </ul>
        <ReactIf show={showCancle}>
          <div className='bottom-select__cancel' onClick={bindClickCancel}>{cancelText}</div>
        </ReactIf>
      </div>
    </BottomLayer>
  )
}

BottomSelect.propTypes = {
  children: PropTypes.node,
  showCancle: PropTypes.bool,
  cancelText: PropTypes.string,
  activeIndex: PropTypes.number,
  onClickItem: PropTypes.func,
  onClickCancel: PropTypes.func,
  hideOnClickItem: PropTypes.bool,
  hideOnClickCancel: PropTypes.bool,
  onClickMask: PropTypes.func,
  hideBottomLayer: PropTypes.func,
  hideOnClickMask: PropTypes.bool,
  show: PropTypes.bool.isRequired,
  selectItems: PropTypes.array.isRequired,
  bottomLayerClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  bottomSelectClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
}

export default BottomSelect
