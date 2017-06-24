const webpack            = require('webpack')
const path               = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './public/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bakeEndCMS.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new CleanWebpackPlugin('dist')
  ]
}
