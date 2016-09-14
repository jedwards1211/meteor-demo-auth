#!/usr/bin/env babel-node

import spawn from '../util/spawn'
import spawnAsync from '../util/spawnAsync'
import asyncScript from '../util/asyncScript'
import installMeteorDeps from './installMeteorDeps'
import path from 'path'

process.on('SIGINT', () => process.exit(1))

const env = {
  ...process.env,
  NODE_ENV: 'production',
  USE_DOTENV: 1,
}

const build = path.resolve(__dirname, '..', 'build')

asyncScript(async () => {
  await spawnAsync('npm', ['run', 'build'], {stdio: 'inherit'})
  await installMeteorDeps()
  spawn('supervisor', ['-w', build, path.join(build, 'index.js')], {env, stdio: 'inherit'})
}, {
  exitOnSuccess: false,
})
