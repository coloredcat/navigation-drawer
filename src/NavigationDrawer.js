import React, { useRef, useCallback, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDrag } from 'react-use-gesture'
import { useSpring, config, animated, useTransition } from 'react-spring'
import styled from 'styled-components'

/**
 * Contains a failsafe to stop the Navigation Drawer from opening
 * @returns { failsafe, setFailsafe } - state and setState to set failsafe
 */
export const NavigationDrawerContext = React.createContext()

/**
 * Containst a state that triggers open from any component
 * @returns { triggerOpen, setTriggerOpen } - state and setState to set failsafe
 */
const TriggerOpenContext = React.createContext()

NavigationDrawerButton.propTypes = {
  children: PropTypes.node.isRequired
}

export function NavigationDrawerButton({ children }) {
  const { setTriggerOpen } = useContext(TriggerOpenContext)
  const openDrawer = () => {
    setTriggerOpen(true)
  }
  return <DrawerButton onClick={openDrawer}>{children}</DrawerButton>
}

const DrawerButton = styled.button`
  background: none;
  border: 0;
  outline: 0;
`

export const useDrawer = () => {
  const [state, setState] = useContext(NavigationDrawerContext)
  const isActive = (active) => {
    setState(!state)
  }

  return { isActive }
}

NavigationDrawerContainer.propTypes = {
  children: PropTypes.node.isRequired
}

/**
 * Adds a navigation drawer that's accessible from all components it wraps. To override gestures import `NavigationDrawerContext`
 * @param {node} children
 */
export default function NavigationDrawerContainer({ children }) {
  const [width, setWidth] = useState(0)

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width)
    }
  }, [])

  const [failsafe, setFailsafe] = useState(false)

  const [triggerOpen, setTriggerOpen] = useState(false)
  return (
    <AppContainer ref={measuredRef}>
      <TriggerOpenContext.Provider value={{ triggerOpen, setTriggerOpen }}>
        <NavigationDrawerContext.Provider value={[failsafe, setFailsafe]}>
          {width > 0 && (
            <NavigationDrawer width={-width} failsafe={failsafe}>
              {children}
            </NavigationDrawer>
          )}
        </NavigationDrawerContext.Provider>
      </TriggerOpenContext.Provider>
    </AppContainer>
  )
}

NavigationDrawer.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.number.isRequired,
  failsafe: PropTypes.bool.isRequired
}

function NavigationDrawer({ children, width, failsafe }) {
  const menuDraggingRef = useRef(false)
  const appDraggingRef = useRef(false)
  const widthPercentage = (width / 100) * 80

  const { triggerOpen, setTriggerOpen } = useContext(TriggerOpenContext)

  const [isOpen, setIsOpen] = useState(false)
  const [{ y }, set] = useSpring(() => ({
    to: { y: width + (width - widthPercentage) }
    // onRest: () => navigationRef.current && router.push(navigationRef.current)
  }))

  const open = useCallback(() => {
    // when cancel is true, it means that the user passed the upwards threshold
    // so we change the spring config to create a nice wobbly effect
    setIsOpen(true)
    console.log(width - widthPercentage)
    set({
      y: width - widthPercentage,
      config: config.default
    })
  }, [set, width, widthPercentage])

  useEffect(() => {
    if (triggerOpen) open()
  }, [triggerOpen, setTriggerOpen, open])

  const close = useCallback(
    (velocity = -0.5) => {
      openRef.current = false
      setIsOpen(false)
      set({ y: width + (width - widthPercentage), config: { ...config.default, velocity } })
      setTriggerOpen(false)
    },
    [set, setTriggerOpen, width, widthPercentage]
  )

  const menuSpring = useCallback(
    (first, last, vx, mx, cancel) => {
      console.log('fuuuuuuck')
      if (first) menuDraggingRef.current = true
      // if this is not the first or last frame, it's a moving frame
      // then it means the user is dragging
      else if (last) setTimeout(() => (menuDraggingRef.current = false), 0)

      // if the user drags up passed a threshold, then we cancel
      // the drag so that the sheet resets to its open position
      if (mx > 0) cancel()

      // when the user releases the sheet, we check whether it passed
      // the threshold for it to close, or if we reset it to its open positino
      if (last) {
        mx > widthPercentage * 0.75 ? open(vx) : close(vx)
        vx < -0.3 && close(vx)
      }
      // when the user keeps dragging, we just move the sheet according to
      // the cursor position
      else
        set({
          y: mx + (width - widthPercentage),
          immediate: false,
          config: config.stiff
        })
    },
    [close, open, set, width, widthPercentage]
  )

  const bind = useDrag(({ first, last, vxvy: [vx], movement: [mx], cancel }) => {
    menuSpring(first, last, vx, mx, cancel)
  })

  const openRef = useRef(false)

  const appSpring = useCallback(
    (first, last, vx, mx, my, x) => {
      console.log('spring running', mx)
      if (first) appDraggingRef.current = true
      // if this is not the first or last frame, it's a moving frame
      // then it means the user is dragging
      else if (last) setTimeout(() => (appDraggingRef.current = false), 0)

      if ((mx > 150 && my < 25) || openRef.current) {
        openRef.current = true
        if (x + width < width - widthPercentage) {
          set({
            y: x + width,
            immediate: false,
            config: config.stiff
          })
        } else {
          open()
        }
      }

      if (last && mx > 150 && my < 25) {
        open()
      } else if (last && mx < 150) {
        close()
      }

      // if (last) vx > 1.5 && open(vx);
    },
    [close, open, set, width, widthPercentage]
  )

  const bindApp = useDrag(({ first, last, vxvy: [vx], movement: [mx, my], xy: [x] }) => {
    if (!failsafe) appSpring(first, last, vx, mx, my, x)
  })

  const backdropTransition = useTransition(isOpen, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  const display = y && y.to((py) => (py < widthPercentage ? 'flex' : 'flex'))
  return (
    <>
      <Drawer
        {...bind()}
        id={'drawer__root'}
        style={{
          paddingLeft: `${-(width - widthPercentage)}px`,
          display,
          transform: y && y.to((y) => `translateX(calc(${y}px))`)
        }}>
        <DrawerContainer>
          <LinksContainer>{'Stuff'}</LinksContainer>
        </DrawerContainer>
      </Drawer>
      {backdropTransition((style, item) => {
        // 3. Render each item
        return item && <Backdrop {...bindApp()} style={style} />
      })}
      <div {...bindApp()} id={'app__root'} style={{ height: '100%' }}>
        {children}
      </div>
    </>
  )
}

export function Controls() {
  const drawer = useDrawer()

  const toggleDrawer = () => {
    drawer.isActive(false)
  }
  return (
    <Content id={'drawer__controls'}>
      <button onClick={toggleDrawer}>Deactivate drawer</button>
    </Content>
  )
}

const Content = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  padding: 3rem 1rem 0 1rem;
`

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  background: white;
`

const Drawer = animated(styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: #fff;
  z-index: 99;
  touch-action: none;
`)

const DrawerContainer = styled.div`
  width: 100%;
  align-self: flex-end;
`

const LinksContainer = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 2em 0 1em 0;

  & li {
    padding: 0.75em 1em;
    border-bottom: 1px solid #edf2f7;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  & li > div > div > div.name {
    font-size: 18px;
    color: hsl(0 0% 0% / 0.85);
    font-weight: 500;
    margin-left: 0.5em;
  }

  & li > div > div > span {
    color: hsl(212 100% 42% / 0.55);
    font-size: 20px;
    margin-left: 0.25em;
  }
`

const Backdrop = animated(styled.div`
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: hsl(0 0% 0% / 0.65);
  z-index: 98;
`)
