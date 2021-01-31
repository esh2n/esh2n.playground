/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa')
const { ESBuildPlugin } = require('esbuild-loader')
const tsconfig = require('./tsconfig.json')

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
  },
  webpack: (config, { webpack, dev, isServer }) => {
    if (!isServer) {
      config.node = { fs: 'empty', module: 'empty' }
    }

    if (!dev) {
      config.plugins.push(
        new webpack.ProvidePlugin({
          /**
           *  Not sure why, This increases bundle size
           * when you would think the oposite would be true!
           */
          // __jsx: ['react', 'createElement'],
          // __fragment: ['react', 'Fragment'],
          React: 'react',
        })
      )
      config.plugins.push(new ESBuildPlugin())
      const convertToESBuild = (obj) => {
        if (obj.loader === 'next-babel-loader') {
          return {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2017',
              tsconfigRaw: tsconfig,
              // jsxFactory: '__jsx',
              // jsxFragment: '__fragment',
            },
          }
        }
        return obj
      }

      const rule = config.module.rules[0]
      if (rule) {
        if (Array.isArray(rule.use)) {
          rule.use = rule.use.map((e) => {
            if (typeof e === 'object') {
              return convertToESBuild(e)
            }
            return e
          })
        } else {
          rule.use = convertToESBuild(rule.use)
        }
      }

      /**
       *  Not sure why, but ESBuildMinifyPlugin makes the bundle larger.
       *
       * With Default Minimization:
       * Main Bundle: 239 KB
       * Largest Page: 122 KB
       *
       * With ESBuild Minification:
       * Main Bundle: 664 KB
       * Largest Page: 132 KB
       *
       * Probably a configuration error.
       */

      // // Remove Default TerserPlugin
      // config.optimization.minimizer.shift();

      // // Add ESBuild Minify
      // config.optimization.minimizer.unshift(
      //   new ESBuildMinifyPlugin({
      //     target: 'es2017',
      //     minify: true,
      //   }),
      // );
    }
    return config
  },
})
