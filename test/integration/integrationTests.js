import {expect} from 'chai'
import exec from '../../scripts/util/exec'
import kill from '../../scripts/util/kill'
import stdouted from '../../scripts/util/stdouted'
import path from 'path'
import rimraf from 'rimraf'
import promisify from 'es6-promisify'
import webpackConfig from '../../webpack/webpack.config.dev'

const root = path.resolve(__dirname, '..', '..')
const build = path.join(root, 'build')

/* global browser: false */

function sharedTests() {
  it('serves page with correct title', async function () {
    expect(await browser.getTitle()).to.equal('meteor-demo-auth')
  })
}

describe('dev mode', function () {
  let server

  before(async function () {
    this.timeout(60000)
    await promisify(rimraf)(build)
    server = exec('npm start')
    await Promise.all([
      stdouted(server, /webpack built [a-z0-9]+ in \d+ms/i),
      stdouted(server, /App is listening on http/i),
    ])
    await browser.url(`http://localhost:${webpackConfig.devServer.port}`)
  })

  after(async function () {
    this.timeout(30000)
    if (server) await kill(server)
  })

  sharedTests()
})