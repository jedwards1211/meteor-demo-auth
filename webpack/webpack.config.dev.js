// @flow

import path from 'path'
import webpack from 'webpack'
import HappyPack from 'happypack'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import MeteorImportsPlugin from 'meteor-imports-webpack-plugin'
import buildDir from '../buildDir'

const root = path.resolve(__dirname, '..')
const srcDir = path.join(root, 'src')
const testDir = path.join(root, 'test')
const clientInclude = [srcDir, testDir]

const { ROOT_URL } = process.env

const config = {
  context: root,
  devtool: 'eval',
  entry: [
    './test/client/index.js',
    'webpack-hot-middleware/client',
  ],
  output: {
    // https://github.com/webpack/webpack/issues/1752
    filename: 'app.js',
    chunkFilename: '[name]_[chunkhash].js',
    path: path.join(buildDir, 'static'),
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      '__CLIENT__': true,
      '__PRODUCTION__': false,
      'Meteor.isClient': true,
      'Meteor.isCordova': false,
      'Meteor.isServer': false,
      'process.env.TARGET': JSON.stringify(process.env.TARGET),
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new HappyPack({
      id: '1', // https://github.com/amireh/happypack/issues/88
      loaders: ['babel'],
      threads: 4,
    }),
    new MeteorImportsPlugin({
      meteorProgramsFolder: path.resolve(buildDir, 'meteor', 'bundle', 'programs'),
      injectMeteorRuntimeConfig: false,
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'happypack/loader',
        include: clientInclude,
        query: {
          'plugins': [
            'react-hot-loader/babel',
          ],
        },
      },
    ],
  },
  watch: true,
  devServer: {
    contentBase: ROOT_URL,
    publicPath: '/static/',
    noInfo: true,
    port: 4000,
    stats: {
      colors: true,
    },
  },
}

if (!process.env.CI) config.plugins.push(new ProgressBarPlugin())

export default config

