import React from 'react'
import { func, shape, number } from 'prop-types'
import gql from 'graphql-tag'
import { ApolloConsumer } from 'react-apollo'
import { Form, Field } from 'react-final-form'

const mutation = gql`
  mutation CreateMessage ($user: String!, $channel: String!, $body: String!) {
    createMessageMessage(input: {
      userId: { targetId: $user }
      body: { value: $body }
      channel: { targetId: $channel }
    }) {
      errors
      violations {
        message
        path
        code
      }
      entity {
        entityId
      }
    }
  }
`

// @TODO: implement optimistic query on messages?

class NewMessageContainer extends React.Component {
  render () {
    return (
      <ApolloConsumer>
        {client => (
          <Form
            children={ this.props.children }
            onSubmit={ ({ body }, { reset }) => {
              reset()
              client.mutate({
                mutation: mutation,
                variables: {
                  body,
                  user: this.props.user.uid,
                  channel: this.props.channel.tid
                }
              }).then(response => {
                this.props.refetch()
              })
            } }
          />
        )}
      </ApolloConsumer>
    )
  }
}

NewMessageContainer.propTypes = {
  children: func,
  user: shape({ uid: number.isRequired }).isRequired,
  channel: shape({ tid: number.isRequired }).isRequired,
  refetch: func
}

/**
 * Composable message field.
 */
NewMessageContainer.Message = props => (
  <Field name='body' { ...props } />
)

export default NewMessageContainer
