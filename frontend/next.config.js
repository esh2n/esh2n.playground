/* eslint-disable
   @typescript-eslint/no-var-requires
*/
const { resolve } = require('path')
const withPWA = require('next-pwa')
const MODE =
  process.env.NODE_ENV === 'development' ? 'development' : 'production'
const withDebug = MODE == 'development'

module.exports = withPWA({
  pwa: {
    disable: true,
    dest: 'public',
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['~'] = resolve(__dirname, 'src')
    // Fixes packages that depend on fs/module module
    if (!isServer) {
      config.node = { fs: 'empty', module: 'empty' }
    }

    config.resolve.extensions.push('.elm')
    if (MODE === 'development') {
      config.module.rules.push({
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: [
          { loader: 'elm-hot-webpack-loader' },
          {
            loader: 'elm-webpack-loader',
            options: {
              // add Elm's debug overlay to output
              debug: withDebug,
            },
          },
        ],
      })
    } else {
      config.module.rules.push({
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: {
          loader: 'elm-webpack-loader',
          options: {
            optimize: true,
          },
        },
      })
    }

    return config
  },
})
