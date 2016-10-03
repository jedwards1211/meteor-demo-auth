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
/* eslint-env browser */

describe('dev mode', function () {
  let server

  before(async function () {
    this.timeout(480000)
    await promisify(rimraf)(build)
    server = exec('npm start')
    await Promise.all([
      stdouted(server, /webpack built [a-z0-9]+ in \d+ms/i),
      stdouted(server, /LISTENING/),
    ])
    await browser.url(`http://localhost:${webpackConfig.devServer.port}`)
  })

  after(async function () {
    this.timeout(30000)
    if (server) await kill(server)
  })

  it('demo login works', async function () {
    this.timeout(60000)
    await browser.executeAsync(done => window.Package.meteor.Meteor.startup(done))
    await browser.executeAsync(done => window.loginForDemo(done))
    const firstUserId = (await browser.executeAsync(done => done(window.Package.meteor.Meteor.userId()))).value
    expect(firstUserId).to.be.defined

    await browser.refresh()
    await browser.executeAsync(done => window.Package.meteor.Meteor.startup(done))
    await browser.executeAsync(done => window.loginForDemo(done))
    const secondUserId = (await browser.executeAsync(done => done(window.Package.meteor.Meteor.userId()))).value
    expect(secondUserId).to.equal(firstUserId)

    await browser.executeAsync(done => {
      localStorage.removeItem('demoLoginToken')
      done()
    })
    await browser.refresh()
    await browser.executeAsync(done => window.Package.meteor.Meteor.startup(done))
    await browser.executeAsync(done => window.loginForDemo(done))
    const thirdUserId = (await browser.executeAsync(done => done(window.Package.meteor.Meteor.userId()))).value
    expect(thirdUserId).to.not.equal(firstUserId)
  })
})