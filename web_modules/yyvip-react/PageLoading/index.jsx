import React from 'react'
import PropTypes from 'prop-types'
import ReactIf from '../property/ReactIf'

import './pageLoading.styl'

const PageLoading = ({
  pageLoading
}) => (
  <ReactIf show={pageLoading}>
    <div className='page-loading-mask'>
      <div className='page-loading-box'>
        <div className='loading before'></div>
        <div className='loading'></div>
        <div className='loading after'></div>
      </div>
    </div>
  </ReactIf>
)

PageLoading.propTypes = {
  pageLoading: PropTypes.bool.isRequired
}

export default PageLoading
