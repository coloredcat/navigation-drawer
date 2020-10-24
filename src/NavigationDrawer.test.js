import React from 'react'
import { shallow, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import SideMenu, { Controls } from './NavigationDrawer'

// Snapshot for Home React Component
describe('>>>Sidemenu --- Snapshot', () => {
  it('+++capturing Snapshot of Sidemenu', () => {
    const renderedValue = renderer
      .create(
        <SideMenu>
          <Controls />
        </SideMenu>
      )
      .toJSON()
    expect(renderedValue).toMatchSnapshot()
  })
})
