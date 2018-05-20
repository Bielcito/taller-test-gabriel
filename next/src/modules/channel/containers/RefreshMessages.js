import React from 'react'
// import { func, number } from 'prop-types'

class RefreshMessages extends React.Component {
  componentDidMount () {
    // this.interval = setInterval(() => {
    //   this.props.refetch()
    // }, this.props.timer)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
    console.log('bye')
  }

  render () {
    return null
  }
}

RefreshMessages.propTypes = {
  // refetch: func,
  // timer: number
}

export default RefreshMessages
