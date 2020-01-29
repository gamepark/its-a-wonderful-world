import React, {CSSProperties} from 'react'

const style = {
  height: `6vh`,
  padding: `0.5vh`,
  textAlign: `center`
} as CSSProperties

const Header = () => {
  return (
    <header style={style}>
      <h1>Welcome!</h1>
    </header>
  )
}

export default Header