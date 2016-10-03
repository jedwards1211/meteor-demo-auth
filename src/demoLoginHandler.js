// @flow

/* eslint-env server */

import {Meteor} from 'meteor/meteor'

Meteor.users._ensureIndex({token: 1})

export default function demoLoginHandler(loginRequest: Object, options?: {
  initDemoUser?: (token: string) => {username: string},
} = {}): ?{userId: string} {
  const initDemoUser = options.initDemoUser || ((token: string): Object => ({username: token}))
  const {demo, token} = loginRequest
  //there are multiple login handlers in meteor.
  //a login request go through all these handlers to find it's login hander
  //so in our login handler, we only consider login requests which has admin field
  if (!demo) return undefined

  var userId = null
  var user = Meteor.users.findOne({token})
  if (!user) userId = Meteor.users.insert({...initDemoUser(token), token})
  else userId = user._id

  // send loggedin user's user id
  return {userId}
}
