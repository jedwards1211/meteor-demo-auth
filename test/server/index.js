/* @flow */

import express from 'express'
import createSSR from './createSSR'
import { WebApp } from 'meteor/webapp'

const app = express()

app.use((req: Object, res: Object, next: Function) => {
  if (/\/favicon\.?(jpe?g|png|ico|gif)?$/i.test(req.url)) {
    res.status(404).end()
  } else {
    next()
  }
})

// server-side rendering
app.get('*', (req: Object, res: Object, next: Function) => {
  // let Meteor handle sockjs requests so that DDP works
  if (/^\/sockjs/.test(req.path)) {
    next()
    return
  }
  createSSR(req, res)
})

WebApp.rawConnectHandlers.use(app)

console.log(`App is listening on http://0.0.0.0:${process.env.PORT || '80'}`) // eslint-disable-line no-console
