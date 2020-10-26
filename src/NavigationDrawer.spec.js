import React from 'react'
import cypress from 'cypress'
import { mount } from 'cypress-react-unit-test'
import NavigationDrawer, { Controls } from './NavigationDrawer.js'
describe('Navigation component', () => {
  it('renders correctly', () => {
    mount(
      <NavigationDrawer>
        <Controls />
      </NavigationDrawer>
    )
    cy.get('button').should('be.visible')
  })
})
