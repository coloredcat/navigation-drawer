import React from 'react'

export const Device = ({ children }) => (
  <div className="marvel-device iphone-x" style={{ background: '#d0d0d0' }}>
    <div className="notch">
      <div className="camera" />
      <div className="speaker" />
    </div>
    <div className="top-bar" />
    <div className="sleep" />
    <div className="bottom-bar" />
    <div className="volume" />
    <div className="overflow">
      <div className="shadow shadow--tr" />
      <div className="shadow shadow--tl" />
      <div className="shadow shadow--br" />
      <div className="shadow shadow--bl" />
    </div>
    <div className="inner-shadow" style={{ opacity: 0.5 }} />
    <div
      className="screen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#272730',
        cursor: `url('https://github.com/chenglou/react-motion/raw/master/demos/demo8-draggable-list/cursor.png') 39 39, auto`
      }}>
      {children}
    </div>
  </div>
)
