import React from 'react'
import gql from 'graphql-tag'
import { func } from 'prop-types'
import { channelName } from 'app/lib/form/validation'
import { ApolloConsumer } from 'react-apollo'
import AddCircleIcon from 'grommet/components/icons/base/Add'
import Button from 'grommet/components/Button'
import styled from 'styled-components'

const mutation = gql`
  mutation CreateChannel ($name: String!) {
    createTaxonomyTermChannel (input: { name: $name }) {
      violations {
        message
        path
        code
      }
      errors
      entity {
        entityId
      }
    }
  }
`

// @TODO: implement optimistic query on channels?
export default class NewChannelContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      channelName: ''
    }

    // Bindings:
    this.inputOnBlur = this.inputOnBlur.bind(this)
    this.inputOnInput = this.inputOnInput.bind(this)
    this.closeButtonOnClick = this.closeButtonOnClick.bind(this)
  }

  validation (value) {
    if (value.length === 0) {
      return 'Channel name can\'t be empty'
    }
    else if (value.length > 0) {
      return channelName(value)
    }
  }

  inputOnBlur (e) {
    this.validation(e.currentTarget.value)
  }

  inputOnInput (e) {
    this.setState({
      channelName: e.currentTarget.value
    })
  }

  setContainerHidden (flag) {
    if (this.container) {
      this.container.hidden = flag
    }
  }

  onSubmit = (e, client) => {
    this.setContainerHidden(false)
    let form = e.currentTarget
    let channelName = form.channelName.value
    if (this.errorMsg(this.validation(channelName))) {
      client.mutate({
        mutation: mutation,
        variables: { name: channelName }
      }).then(() => {
        this.props.refetch()
        this.setContainerHidden(true)
      })
    }
  }

  errorMsg (text) {
    if (text === false) {
      this.errorbox.hidden = true
      return true
    }
    else {
      this.errorbox.innerHTML = text
      this.errorbox.hidden = false
      return false
    }
  }

  closeButtonOnClick (e) {
    this.setState({
      channelName: ''
    })
    this.container.hidden = true
  }

  render () {
    return (
      <div>
        <AddChannelButton
          icon={ <AddCircleIcon /> }
          onClick={ () => {
            this.setContainerHidden(false)
          } }
        />
        <div
          ref={ (e) => {
            this.container = e
          } }
          className='confirmation-box'
          hidden
        >
          <div className='close-button' onClick={ this.closeButtonOnClick }> ☓ </div>
          <h2> Name your new channel </h2>
          <ApolloConsumer>
            {client => (
              <form action='javascript:void(0)' onSubmit={ (e) => this.onSubmit(e, client) }>
                <label>
                  <input
                    type='text'
                    name='channelName'
                    placeholder='Channel name'
                    onBlur={ this.inputOnBlur }
                    onInput={ this.inputOnInput }
                    value={ this.state.channelName }
                  />
                </label><br />
                <br />
                <div
                  ref={ (e) => {
                    this.errorbox = e
                  } }
                  className='errorBox'
                  hidden
                />
                <button type='submit'> Create </button>
              </form>
            )}
          </ApolloConsumer>
        </div>
      </div>
    )
  }
}

NewChannelContainer.propTypes = {
  refetch: func
}

const AddChannelButton = styled(Button)`
  margin-left: auto;
`
