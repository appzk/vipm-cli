import React from 'react'
import PropTypes from 'prop-types'
import PageModal from '../PageModal'

import './pageConfirm.styl'

const PageConfirm = ({
  cancelButtonText = '取消', confirmButtonText = '确定', onCancel, onConfirm, hideOnCancel = true, hideOnConfirm = true, hidePageModal, children, ...props
}) => {
  const bindConfirm = (e) => {
    e.stopPropagation()
    onConfirm && onConfirm(e)
    hideOnConfirm && hidePageModal && hidePageModal(e)
  }
  const bindCancel = (e) => {
    e.stopPropagation()
    onCancel && onCancel(e)
    hideOnCancel && hidePageModal && hidePageModal(e)
  }
  return (
    <PageModal hidePageModal={hidePageModal} {...props}>
      <div className='page-modal__main__box__body'>
        <div className='page-confirm__body'>{children}</div>
      </div>
      <div className='page-modal__main__box__foot'>
        <div className='page-confirm__foot'>
          <div className='page-confirm__foot__cancel' onClick={bindCancel}>{cancelButtonText}</div>
          <div className='page-confirm__foot__confirm' onClick={bindConfirm}>{confirmButtonText}</div>
        </div>
      </div>
    </PageModal>
  )
}

PageConfirm.propTypes = {
  children: PropTypes.node,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  showClose: PropTypes.bool,
  onClickMask: PropTypes.func,
  onClickClose: PropTypes.func,
  hideOnCancel: PropTypes.bool,
  hideOnConfirm: PropTypes.bool,
  hidePageModal: PropTypes.func,
  hideOnClickMask: PropTypes.bool,
  hideOnClickClose: PropTypes.bool,
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  isShow: PropTypes.bool.isRequired,
  pageModalClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
}

export default PageConfirm
