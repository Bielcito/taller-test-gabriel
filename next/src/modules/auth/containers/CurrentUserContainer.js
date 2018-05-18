import React from 'react'
import { func } from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Router from 'next/router'

import { isClient } from 'app/lib/func'

const query = gql`
  query CurrentUser {
    user: currentUserContext {
      uid
      name
      mail
    }
  }
`

let refetchedOnClient = false
let userDataObtained = false

const CurrentUserContainer = ({ children }) => (
  <Query query={ query }>
    { ({ ...result, loading, refetch, data, networkStatus }) => {
      // Force a refetch on the client inside to make sure
      // the cached SSR anonymous user is replaced, in case
      // the user is already logged in..
      if (!loading && !refetchedOnClient && isClient()) {
        refetchedOnClient = true
        refetch()
      }

      if (userDataObtained) {
        if (data.user.uid === null) {
          Router.push('/')
        }
      }

      if (loading && refetchedOnClient && !userDataObtained) {
        userDataObtained = true
      }

      return children({ ...result, user: data.user })
    } }
  </Query>
)

CurrentUserContainer.propTypes = {
  children: func,
}

export default CurrentUserContainer
