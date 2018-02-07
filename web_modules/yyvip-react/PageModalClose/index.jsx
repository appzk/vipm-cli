import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import ReactShow from '../property/ReactShow'

import './pageModalClose.styl'

const PageModalClose = ({
  isShow, onClickClose, hidePageModal, pageModalClass = 'page-modal-close--default', children
}) => {
  const bindClickMask = (e) => {
    e.stopPropagation()
    onClickClose && onClickClose(e)
    hidePageModal && hidePageModal(e)
  }
  return (
    <ReactShow show={isShow}>
      <div className={classnames('page-modal-close', pageModalClass)}>
        <div className='page-modal-close__main'>
          <div className='page-modal-close__main__box'>{children}</div>
          <div className='page-modal-close__main__close-btn' onClick={bindClickMask}>X</div>
        </div>
      </div>
    </ReactShow>
  )
}

PageModalClose.propTypes = {
  children: PropTypes.node,
  onClickClose: PropTypes.func,
  hidePageModal: PropTypes.func,
  isShow: PropTypes.bool.isRequired,
  pageModalClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
}

export default PageModalClose
