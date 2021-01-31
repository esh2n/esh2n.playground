/// <reference types="cypress" />

describe('Test title', () => {
  it('Given "/" route, When get props. Then get title "Create Next App".', () => {
    cy.visit('/')
    cy.title().should('include', 'Create Next App')
  })
})

export {}
