const merge = require('webpack-merge')
const commonConfig = require('./webpack.config.js')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: path.join(__dirname, 'workshop/index.tsx'),
  devServer: {
    contentBase: path.join(__dirname, 'workshop')
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.join(__dirname, 'workshop/index.html'),
    filename: './index.html'
  })]
})