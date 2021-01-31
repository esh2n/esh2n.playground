module.exports = {
  // DMX,SVG
  transform: {
    '^.+\\.svg$': 'jest-svg-transformer',
    '^.+\\.jsx?$': 'ts-jest',
    '^.+\\.mdx$': '@storybook/addon-docs/jest-transform-mdx',
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    // CSS mock
    '\\.(css|scss)$': 'identity-obj-proxy',
    // alias
    '^(pages|components)/(.+)': '<rootDir>/src/$1/$2',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
}
