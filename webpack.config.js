module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
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