import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class ScrollControl extends React.Component {
  componentDidUpdate (prevProps, prevState) {
    if (this.props.children !== undefined && this.refs !== undefined && this.refs[0] !== undefined) {
      let div = ReactDOM.findDOMNode(this.refs[Object.keys(this.refs).length - 1])
      div.scrollIntoView()
    }
  }

  render () {
    if (this.props.children !== undefined && this.props.children instanceof Array) {
      return (
        <div>
          {React.Children.map(this.props.children, (element, idx) => {
            return React.cloneElement(element, { ref: idx })
          })}
        </div>
      )
    }
    else {
      return this.props.children
    }
  }
}

ScrollControl.propTypes = {
  children: PropTypes.any
}

export default ScrollControl
