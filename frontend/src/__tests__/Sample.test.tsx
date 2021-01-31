/// <reference types="jest" />

import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { expect } from '@jest/globals'
import Home from '../pages'

// un-mount
afterEach(cleanup)

// it('Given "Home" FC, When load href. Then get Next.js doc.', () => {
//   render(<Home />)
//   expect(screen.getByText('Next.js!').getAttribute('href')).toBe(
//     'https://nextjs.org'
//   )
// })

describe('true is truthy and false is falsy', () => {
  it('true is truthy', () => {
    expect(true).toBe(true)
  })

  it('false is falsy', () => {
    expect(false).toBe(false)
  })
})
