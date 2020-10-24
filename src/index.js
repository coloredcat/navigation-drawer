import React from 'react'
import ReactDOM from 'react-dom'
import { Device } from './Device'
import SideMenu, { Controls } from './NavigationDrawer'
import './styles.css'

function App() {
  return (
    <Device>
      <SideMenu>
        <Controls />
      </SideMenu>
    </Device>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
