import React, {FunctionComponent} from 'react'

let style = {
  position: 'relative',
  height: '100%',
  minWidth: '16 / 9 * 100vh',
  overflow: 'hidden',
  userSelect: 'none'
}

const Game: FunctionComponent = ({children}) => {
  return (
    <div style={style}>
      {children}
    </div>
  )
}

export default Game