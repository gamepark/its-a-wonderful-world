import {css, keyframes} from '@emotion/core'

export const glow = (color: string) => keyframes`
  from {
    box-shadow: 0 0 5px ${color};
  }
  to {
    box-shadow: 0 0 30px ${color};
  }
`
export const popupBackgroundStyle = css`
  position: fixed;
  top: -100%;
  bottom: -100%;
  left: -100%;
  right: -100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`
