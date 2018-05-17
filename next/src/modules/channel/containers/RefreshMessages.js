import React from 'react'
import { func, number } from 'prop-types'

class RefreshMessages extends React.Component {
  componentDidMount () {
    this.interval = setInterval(() => {
      this.props.refetch()
    }, this.props.timer)
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
  refetch: func,
  timer: number
}

/*  = ({ children, channel }) => (
  channel && channel.tid ? (
    <Query query={ query } variables={ { channel: channel.tid } }>
      { pipe(normalize, children) }
    </Query>
  ) : (
    <Box full='vertical' justify='center' align='center'>
      <AlertIcon size='large' colorIndex='critical' />
      <Heading tag='h2'>This channel does not exist :(</Heading>
    </Box>
  )
)

MessagesContainer.propTypes = {
  children: func,
  channel: shape({
    tid: number.isRequired
  })
}  */

export default RefreshMessages
