// @flow

/* eslint-env browser */

import {Accounts} from 'meteor/accounts-base'
import uuid from 'uuid'

export default function loginForDemo(callback: (err: ?Error) => any) {
  if (!localStorage.getItem('demoLoginToken')) {
    localStorage.setItem('demoLoginToken', uuid.v4())
  }
  Accounts.callLoginMethod({
    methodArguments: [{
      demo: true,
      token: localStorage.getItem('demoLoginToken'),
    }],
    userCallback: callback,
  })
}
