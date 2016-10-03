# meteor-demo-auth

[![Build Status](https://travis-ci.org/jedwards1211/meteor-demo-auth.svg?branch=master)](https://travis-ci.org/jedwards1211/crater)

## Purpose

For showing app demos, this enables you to automatically log a user into a new account when they go to your demo site.
It stores a token in `localStorage` and will log them into the same account if they return to the page, so that their
settings in the demo site are persisted.

## Requirements

This package is designed for usage with [Crater](https://github.com/jedwards1211/crater).  You can probably get it to
work with a non-Crater Meteor project, but you'll have to figure out how to on your own.

## Usage

```
npm install --save meteor-demo-auth
```

On the server:
```es6
import {Accounts} from 'meteor/accounts-base'
import demoLoginHandler from 'meteor-demo-auth/lib/demoLoginHandler'

Accounts.registerLoginHandler(demoLoginHandler)
```

On the client:
```es6
import {Meteor} from 'meteor/meteor'
import loginForDemo from 'meteor-demo-auth/lib/loginForDemo'

Meteor.startup(() => {
  loginForDemo()
})
```
