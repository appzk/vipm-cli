import React from 'react'
import PropTypes from 'prop-types'
import PageModal from '../PageModal'

import './pageAlert.styl'

const PageAlert = ({
  alertButtonText = '确定', children, onConfirm, hideOnConfirm = true, hidePageModal, ...props
}) => {
  const bindConfirm = (e) => {
    e.stopPropagation()
    onConfirm && onConfirm(e)
    hideOnConfirm && hidePageModal && hidePageModal(e)
  }
  return (
    <PageModal hidePageModal={hidePageModal} {...props}>
      <div className='page-modal__main__box__body'>
        <div className='page-alert__body'>{children}</div>
      </div>
      <div className='page-modal__main__box__foot'>
        <div className='page-alert__foot' onClick={bindConfirm}>{alertButtonText}</div>
      </div>
    </PageModal>
  )
}

PageAlert.propTypes = {
  children: PropTypes.node,
  showClose: PropTypes.bool,
  onConfirm: PropTypes.func,
  onClickMask: PropTypes.func,
  onClickClose: PropTypes.func,
  hideOnConfirm: PropTypes.bool,
  hidePageModal: PropTypes.func,
  hideOnClickMask: PropTypes.bool,
  hideOnClickClose: PropTypes.bool,
  alertButtonText: PropTypes.string,
  isShow: PropTypes.bool.isRequired,
  pageModalClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
}

export default PageAlert
