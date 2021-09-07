import type * as React from 'react'

function App() {
  return (
    <div
      className={'top-bar'}
      style={{
        width: '100%',
        height: 45,
        position: 'fixed',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 5px 0px #D9D7E5',
        top: 0,
        zIndex: 10
      }}
    />
  )
}

export default App
