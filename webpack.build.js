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
    library: 'ItsAWonderfulWorld',
    libraryTarget: 'umd',
    publicPath: '/dist/',
    umdNamedDefine: true,
    globalObject: 'this'
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
  },
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'react-i18next': path.resolve(__dirname, './node_modules/react-i18next'),
      'tabletop-game-workshop': path.resolve(__dirname, './node_modules/tabletop-game-workshop')
    }
  },
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    },
    'react-i18next': 'react-i18next',
    'tabletop-game-workshop': 'tabletop-game-workshop'
  }
})