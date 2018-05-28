import { pipe, defaultTo, map, prop, over, lensProp } from 'ramda'
import React from 'react'
import { func, shape, number } from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import Box from 'grommet/components/Box'
import Heading from 'grommet/components/Heading'
import AlertIcon from 'grommet/components/icons/base/Alert'

import { rename } from 'app/lib/func'

const query = gql`
  query Messages ($channel: String!) {
    messages: messageQuery(
      limit: 50
      filter: {
        conditions: [{
          field: "channel"
          value: [$channel]
        }]
      }
    ) {
      count
      entities {
        id
        author: entityOwner {
          name
          mail
        }
        ... on Message {
          message: body {
            value
          }
        }
      }
    }
  }
`

const normalizeMessage = pipe(
  over(lensProp('author'), defaultTo([])),
  over(lensProp('message'), prop('value'))
)

const normalize = pipe(
  rename('data', 'messages'),
  over(lensProp('messages'), pipe(
    prop('messages'),
    prop('entities'),
    defaultTo([]),
    map(normalizeMessage)
  )),
)

const test = (normalize, children) => {
  console.log(normalize, children)
  return pipe(normalize, children)
}

class MessagesContainer extends React.Component {
  render () {
    if (this.props.channel && this.props.channel.tid) {
      return (
        <Query query={ query } variables={ { channel: this.props.channel.tid } }>
          { test(normalize, this.props.children) }
          {/* { pipe(normalize, this.props.children) } */}
        </Query>
      )
    }
    else {
      return (
        <Box full='vertical' justify='center' align='center'>
          <AlertIcon size='large' colorIndex='critical' />
          <Heading tag='h2'>This channel does not exist :(</Heading>
        </Box>
      )
    }
  }
}

MessagesContainer.propTypes = {
  children: func,
  channel: shape({
    tid: number.isRequired
  })
}

export default MessagesContainer
