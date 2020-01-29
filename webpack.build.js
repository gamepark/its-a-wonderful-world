const merge = require('webpack-merge')
const commonConfig = require('./webpack.config.js')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
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
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|svg|gif|ico|webp)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          outputPath: 'static',
          publicPath: '/static/its-a-wonderful-world'
        }
      }
    ]
  }
})