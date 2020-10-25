import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { render, unmountComponentAtNode } from 'react-dom'
import renderer from 'react-test-renderer'
import SideMenu, { Controls } from './NavigationDrawer'
import { act } from 'react-dom/test-utils'

configure({ adapter: new Adapter() })

function createClientXY(x, y) {
  return { clientX: x, clientY: y }
}

export function createStartTouchEventObject({ x = 0, y = 0 }) {
  return { touches: [createClientXY(x, y)] }
}

export function createMoveTouchEventObject({ x = 0, y = 0 }) {
  return { changedTouches: [createClientXY(x, y)] }
}

// Snapshot for Home React Component
describe('Navigation Drawer', () => {
  const component = mount(
    <SideMenu defaultWidth={300}>
      <Controls />
    </SideMenu>
  )
  it('renders without errors', () => {
    expect(component.html()).toMatchSnapshot()
  })
  it('creates new snapshot', () => {
    const componentRoot = component.find('#drawer__root').at(0) // This returns three nodes for some reason
    console.log(componentRoot.debug())
    componentRoot.simulate('touchStart', createStartTouchEventObject({ x: 100, y: 0 }))
    componentRoot.simulate('touchMove', createMoveTouchEventObject({ x: 150, y: 0 }))
    componentRoot.simulate('touchEnd', createMoveTouchEventObject({ x: 200, y: 0 }))

    expect(component.html()).toMatchSnapshot()
  })
})
