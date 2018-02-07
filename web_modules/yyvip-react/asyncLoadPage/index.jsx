import React, {
  Component
} from 'react'
import Page404 from '../Page404'

export default loadComponent => (
  class AsyncComponent extends Component {
    constructor(...args) {
      super(...args)
      this.state = {
        use404: false,
        PageComponent: null
      }
    }

    componentWillMount() {
      if (this.state.PageComponent === null) {
        loadComponent()
          .then(module => module.default || module)
          .then((PageComponent) => {
            this.setState({
              PageComponent
            })
          })
          .then(_ => this.forceUpdate())
          .catch(_ => {
            this.setState({
              use404: true
            })
          })
      }
    }

    render() {
      const {
        use404,
        PageComponent
      } = this.state
      return use404 ? <Page404 /> : (PageComponent ? <PageComponent {...this.props} /> : null)
    }
  }
)
