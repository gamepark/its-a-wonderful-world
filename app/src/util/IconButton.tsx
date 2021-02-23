import {css} from '@emotion/core'
import React, {FunctionComponent, useEffect, useState} from 'react'

type Props = React.HTMLAttributes<HTMLButtonElement> & { disabled?: boolean }

const IconButton: FunctionComponent<Props> = ({children, disabled = false, ...props}) => {
  const [active, setActive] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  function onMouseDown(event: React.MouseEvent<HTMLButtonElement>) {
    setActive(true)
    if (timer) {
      clearTimeout(timer)
    }
    if (props.onMouseDown) {
      props.onMouseDown(event)
    }
  }

  function onMouseUp(event: React.MouseEvent<HTMLButtonElement>) {
    setTimer(setTimeout(() => setActive(false), 500))
    if (props.onMouseUp) {
      props.onMouseUp(event)
    }
  }

  useEffect(() => () => timer && clearTimeout(timer))

  return (
    <button type="button" {...props} css={[buttonStyle, active ? activeStyle : '', disabled ? disabledStyle : '']}
            onMouseDown={onMouseDown} onMouseUp={onMouseUp} disabled={disabled}>
      {children}
    </button>
  )
}

const buttonStyle = css`
  border: 0;
  cursor: pointer;
  margin: 0;
  display: inline-flex;
  outline: 0;
  position: relative;
  align-items: center;
  user-select: none;
  vertical-align: middle;
  -moz-appearance: none;
  justify-content: center;
  text-decoration: none;
  background-color: transparent;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  flex: 0 0 auto;
  color: rgba(0, 0, 0, 0.54);
  overflow: visible;
  text-align: center;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 50%;
  padding: 0.5em;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    transform: scale(0);
    transition: transform 0.3s ease;
  }

  & > svg {
    fill: currentColor;
    width: 1em;
    height: 1em;
    display: inline-block;
    transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    flex-shrink: 0;
    user-select: none;
  }
`

const activeStyle = css`
  &:before {
    transform: scale(1);
  }
`

const disabledStyle = css`
  opacity: 0.5;
`

export default IconButton