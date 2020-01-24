const merge = require('webpack-merge')
const commonConfig = require('./webpack.config.js')
const path = require('path')

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: {
    game: './src/game.tsx',
    rules: './src/rules.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  }
})