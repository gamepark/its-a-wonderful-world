const path = require('path')

module.exports = {
  entry: {
    game: './src/game.tsx',
    rules: './src/rules.ts'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.(jpe?g|png|svg|gif|ico|webp)$/,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader'
        }
      }
    ]
  }
}