/// <reference types="cypress" />
import React from 'react'
import ReactDom from 'react-dom'
import { mount } from 'cypress-react-unit-test'
import NavigationDrawer, { Controls } from './NavigationDrawer.js'
import './styles.css'
describe('Navigation component', () => {
  beforeEach(() => {
    cy.viewport('iphone-6')
  })

  it('renders correctly', () => {
    mount(
      <div style={{ height: '667px', width: '375px ' }}>
        <NavigationDrawer>
          <Controls />
        </NavigationDrawer>
      </div>,
      { React, ReactDom }
    )
    cy.get('button').should('be.visible')
  })

  it('has no overflow', () => {
    cy.get('#drawer__controls').invoke('outerHeight').should('be.eql', 667)
    cy.get('#drawer__controls').invoke('outerWidth').should('be.eql', 375)
  })

  it('opens on drag', () => {
    cy.get('#app__root').swipe({ delay: 2000, draw: true, steps: 10 }, [50, 80], [300, 80])
  })
})
