import {Meteor} from 'meteor/meteor'
import url from 'url'
import type {IncomingMessage, ServerResponse} from 'http'

const __meteor_runtime_config__ = {
  PUBLIC_SETTINGS: Meteor.settings.public || {},
  ROOT_URL: process.env.ROOT_URL,
  // Not everything is in place to support basename right now (e.g. react-router history config, webpack config)
  // but might as well go ahead and use the correct value here anyway
  ROOT_URL_PATH_PREFIX: url.parse(process.env.ROOT_URL).pathname.substring(1),
  meteorEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  meteorRelease: Meteor.release,
}

function createSSR(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charSet="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>meteor-demo-auth</title>
  </head>
  <body>
    <script>
      window.__meteor_runtime_config__ = ${JSON.stringify(__meteor_runtime_config__)}
    </script>
    <script src="/static/app.js"></script>
  </body>
</html>
`
    res.write(html)
    res.end()
  } catch (error) {
    console.error(error.stack) // eslint-disable-line no-console
  }
}

export default createSSR
