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
  entry: './public/dev.js',
  output: {
    path: path.resolve('dev'),
    filename: '[name]__[hash]__bakeEndCMS.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.js', '.json', '.css'],
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new CleanWebpackPlugin('dev')
  ]
}
