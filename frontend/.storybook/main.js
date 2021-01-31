/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')
const path = require('path')
const toPath = (_path) => path.join(process.cwd(), _path)
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: resolve(__dirname, '../'),
    })
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        plugins: ['emotion'],
      },
    })
    config.resolve.alias = {
      ...config.resolve.alias,
      components: resolve(__dirname, '../src/components'),
      styles: resolve(__dirname, '../src/styles'),
      '@emotion/core': toPath('node_modules/@emotion/react'),
      '@emotion/styled': toPath('node_modules/@emotion/styled'),
      'emotion-theming': toPath('node_modules/@emotion/react'),
      '@emotion/css': toPath('node_modules/@emotion/css'),
    }
    config.resolve.extensions.push('.ts', '.tsx')
    return config
  },
}
