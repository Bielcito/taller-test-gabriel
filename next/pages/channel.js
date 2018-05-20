/**
 * This is the page rendered when inside a chat room.
 */

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Router from 'next/router'

import { HashLoader } from 'react-spinners'
import App from 'grommet/components/App'
import ChatIcon from 'grommet/components/icons/base/Chat'
import AddCircleIcon from 'grommet/components/icons/base/Add'
import UserIcon from 'grommet/components/icons/base/User'
import LogoutIcon from 'grommet/components/icons/base/Logout'
import Split from 'grommet/components/Split'
import Sidebar from 'grommet/components/Sidebar'
import Header from 'grommet/components/Header'
import Footer from 'grommet/components/Footer'
import Title from 'grommet/components/Title'
import Box from 'grommet/components/Box'
import Menu from 'grommet/components/Menu'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import Paragraph from 'grommet/components/Paragraph'
import Label from 'grommet/components/Label'

import bootstrap from 'app/lib/bootstrap'
import TextInput from 'app/modules/form/components/TextInput'

const StyledRoomHeader = styled(Header)`
  border-bottom: 1px solid #ddd;
`

const StyledMessage = styled(Paragraph)`
  margin: 0;
`

const StyledAuthor = styled(Label)`
  margin: 0;
`

const StyledTextInput = styled(TextInput)`
  width: 100%;
`

const AddChannelButton = styled(Button)`
  margin-left: auto;
`

const StyledBox = styled(Box)`
  display: block;
  height: 0;
  overflow: auto;
`

const LoadingComponent = () => (
  <Box full='vertical' justify='center' align='center'>
    <HashLoader color='#e02438' loading />
  </Box>
)

import CurrentUserContainer from 'app/modules/auth/containers/CurrentUserContainer'
import ChannelsContainer from 'app/modules/channel/containers/ChannelsContainer'
import MessagesContainer from 'app/modules/channel/containers/MessagesContainer'
import NewMessageContainer from 'app/modules/channel/containers/NewMessageContainer'
import NewChannelContainer from 'app/modules/channel/containers/NewChannelContainer'
import RefreshMessages from 'app/modules/channel/containers/RefreshMessages'

const StyledSplit = styled(Split)`
  > :nth-child(2) {
    overflow: unset;
  }
`

/* Pego em: https://gist.github.com/codeguy/6684588 */
function stringToSlug (str) {
  if (typeof str !== 'string') {
    console.log(str)
    return
  }
  str = str.trim() // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  let from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
  let to = 'aaaaeeeeiiiioooouuuunc------'
  for (let i = 0, l = from.length; i < l; ++i) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}

class ChatRoom extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      channel: stringToSlug(props.url.asPath.split('#')[1])
    }
  }

  getChannel (channels) {
    return channels.find(({ name }) => stringToSlug(name) === stringToSlug(this.state.channel))
  }

  getChannelName (channels) {
    let channel = channels.find(({ name }) => stringToSlug(name) === stringToSlug(this.state.channel))
    if (channel) {
      return channel.name
    }
    else {
      return undefined
    }
  }

  onClickLinkHandle (name) {
    this.setState({
      channel: decodeURIComponent(name)
    })
    let channel = stringToSlug(name)
    Router.push(`/messages#${channel}`)
  }

  render () {
    return (
      <CurrentUserContainer>
        { ({ user }) => (
          <ChannelsContainer>
            { ({ loading, channels }) => (
              (loading && !channels.length) ? <LoadingComponent /> : (
                <App centered={ false }>
                  <StyledSplit fixed flex='right'>
                    <Sidebar colorIndex='neutral-1'>
                      <Header pad='medium'>
                        <Title>
                          TallerChat <ChatIcon />
                        </Title>

                        <NewChannelContainer channels={ channels }>
                          { create => (
                            <AddChannelButton
                              icon={ <AddCircleIcon /> }
                              onClick={ () => create(
                                window.prompt('Name your new channel')
                              ) }
                            />
                          ) }
                        </NewChannelContainer>
                      </Header>

                      <Box flex='grow' justify='start'>
                        <Menu primary>
                          { channels.map(({ name }) => (
                            <Anchor key={ name } onClick={ () => this.onClickLinkHandle(name) } className={ this.getChannelName(channels) === name ? 'active' : '' }>
                              # <b>{ name }</b>
                            </Anchor>
                          )) }
                        </Menu>
                      </Box>

                      <Footer pad='medium'>
                        <Button icon={ <UserIcon /> } onClick={ console.log } />
                        <Button icon={ <LogoutIcon /> } onClick={ console.log } />
                      </Footer>
                    </Sidebar>

                    { !user || !user.uid ? (
                      <LoadingComponent />
                    ) : (
                      <MessagesContainer channel={ this.getChannel(channels) }>
                        { ({ loading, refetch, messages }) => (
                          <Box full='vertical'>
                            <RefreshMessages refetch={ refetch } timer={ 3000 } />
                            <StyledRoomHeader pad={ { vertical: 'small', horizontal: 'medium' } } justify='between'>
                              <Title>
                                { '#' + this.getChannelName(channels) }
                              </Title>

                            </StyledRoomHeader>

                            <StyledBox pad='medium' flex='grow'>
                              { loading ? 'Loading...' : (
                                messages.length === 0 ? 'No one talking here yet :(' : (
                                  messages.map(({ id, author, message }) => (
                                    <Box key={ id } pad='small' credit={ author }>
                                      <StyledAuthor>{ author }</StyledAuthor>
                                      <StyledMessage>{ message }</StyledMessage>
                                    </Box>
                                  ))
                                )
                              ) }
                            </StyledBox>

                            <Box pad='medium' direction='column'>
                              { user && user.uid ? (
                                <NewMessageContainer
                                  user={ user }
                                  channel={ this.getChannel(channels) }
                                >
                                  { ({ handleSubmit }) => (
                                    <form onSubmit={ handleSubmit }>
                                      <NewMessageContainer.Message
                                        placeHolder='Message #general'
                                        component={ StyledTextInput }
                                      />
                                    </form>
                                  ) }
                                </NewMessageContainer>
                              ) : (
                                'Log in to post messages'
                              ) }
                            </Box>
                          </Box>
                        ) }
                      </MessagesContainer>
                    ) }

                  </StyledSplit>
                </App>
              )
            ) }
          </ChannelsContainer>
        ) }
      </CurrentUserContainer>
    )
  }
}

/*  const ChatRoom2 = ({ url, url: { query: { channel = getChannelName(url) } } }) => (
  <CurrentUserContainer>
    { ({ user }) => (
      <ChannelsContainer>
        { ({ loading, channels }) => (
          (loading && !channels.length) ? <LoadingComponent /> : (
            <App centered={ false }>
              <StyledSplit fixed flex='right'>
                <Sidebar colorIndex='neutral-1'>
                  <Header pad='medium'>
                    <Title>
                      TallerChat <ChatIcon />
                    </Title>

                    <NewChannelContainer channels={ channels }>
                      { create => (
                        <AddChannelButton
                          icon={ <AddCircleIcon /> }
                          onClick={ () => create(
                            window.prompt('Name your new channel')
                          ) }
                        />
                      ) }
                    </NewChannelContainer>
                  </Header>

                  <Box flex='grow' justify='start'>
                    <Menu primary>
                      { channels.map(({ name }) => (
                        <Link key={ name } prefetch href={ `/messages#${name}` }>
                          <Anchor className={ channel === name ? 'active' : '' }>
                            # <b>{ name }</b>
                          </Anchor>
                        </Link>
                      )) }
                    </Menu>
                  </Box>

                  <Footer pad='medium'>
                    <Button icon={ <UserIcon /> } onClick={ console.log } />
                    <Button icon={ <LogoutIcon /> } onClick={ console.log } />
                  </Footer>
                </Sidebar>

                { !user || !user.uid ? (
                  <LoadingComponent />
                ) : (
                  <MessagesContainer channel={ channels.find(({ name }) => name === channel) }>
                    { ({ loading, refetch, messages }) => (
                      <Box full='vertical'>
                        <RefreshMessages refetch={ refetch } timer={ 3000 } />
                        <StyledRoomHeader pad={ { vertical: 'small', horizontal: 'medium' } } justify='between'>
                          <Title>
                            { '#' + channel }
                          </Title>

                        </StyledRoomHeader>

                        <StyledBox pad='medium' flex='grow'>
                          { loading ? 'Loading...' : (
                            messages.length === 0 ? 'No one talking here yet :(' : (
                              messages.map(({ id, author, message }) => (
                                <Box key={ id } pad='small' credit={ author }>
                                  <StyledAuthor>{ author }</StyledAuthor>
                                  <StyledMessage>{ message }</StyledMessage>
                                </Box>
                              ))
                            )
                          ) }
                        </StyledBox>

                        <Box pad='medium' direction='column'>
                          { user && user.uid ? (
                            <NewMessageContainer
                              user={ user }
                              channel={ channels.find(({ name }) => name === channel) }
                            >
                              { ({ handleSubmit }) => (
                                <form onSubmit={ handleSubmit }>
                                  <NewMessageContainer.Message
                                    placeHolder='Message #general'
                                    component={ StyledTextInput }
                                  />
                                </form>
                              ) }
                            </NewMessageContainer>
                          ) : (
                            'Log in to post messages'
                          ) }
                        </Box>
                      </Box>
                    ) }
                  </MessagesContainer>
                ) }

              </StyledSplit>
            </App>
          )
        ) }
      </ChannelsContainer>
    ) }
  </CurrentUserContainer>
)  */

ChatRoom.propTypes = {
  url: PropTypes.object.isRequired
}

export default bootstrap(ChatRoom)
