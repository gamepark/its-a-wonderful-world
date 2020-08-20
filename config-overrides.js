const {override, addBabelPreset} = require('customize-cra')

module.exports = (config, env) => {
  config.module.rules.splice(0, 0, {
    test: /\.worker\.(js|ts)$/i,
    use: [{
      loader: 'comlink-loader',
      options: {
        singleton: true
      }
    }]
  });
  return override(addBabelPreset('@emotion/babel-preset-css-prop'))(config, env)
}