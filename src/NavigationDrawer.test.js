import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import renderer from 'react-test-renderer'
import SideMenu, { Controls } from './NavigationDrawer'

configure({ adapter: new Adapter() })

// Snapshot for Home React Component
describe('>>>Sidemenu --- Snapshot', () => {
  it('+++capturing Snapshot of Sidemenu', () => {
    const wrapper = mount(
      <SideMenu>
        <Controls />
      </SideMenu>
    )
    expect(wrapper.html()).toMatchSnapshot()
  })
})
