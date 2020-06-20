import {css, keyframes} from '@emotion/core'
import React from 'react'

const LoadingSpinner = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div css={style} {...props}>
    <div css={bullet1}/>
    <div css={bullet2}/>
    <div css={bullet3}/>
    <div css={bullet4}/>
    <div css={bullet5}/>
    <div css={bullet6}/>
    <div css={bullet7}/>
    <div css={bullet8}/>
  </div>
)

const keyframe = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`

const style = css`
  width: 4vh;
  height: 4vh;
  & > div {
    animation-name: ${keyframe};
    animation-duration: 1.2s;
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    animation-iteration-count: infinite;
    transform-origin: 2vh 2vh;
    &:after {
      content: " ";
      display: block;
      position: absolute;
      width: 0.35vh;
      height: 0.35vh;
      border-radius: 50%;
      background: #EEE;
      margin: -0.2vh 0 0 -0.2vh;
    }
  }
`

const bullet1 = css`
  animation-delay: -0.036s;
  &:after {
    top: 3.15vh;
    left: 3.15vh;
  }
`

const bullet2 = css`
  animation-delay: -0.072s;
  &:after {
    top: 3.4vh;
    left: 2.8vh;
  }
`

const bullet3 = css`
  animation-delay: -0.108s;
  &:after {
    top: 3.55vh;
    left: 2.4vh;
  }
`

const bullet4 = css`
  animation-delay: -0.144s;
  &:after {
    top: 3.6vh;
    left: 2vh;
  }
`

const bullet5 = css`
  animation-delay: -0.18s;
  &:after {
    top: 3.55vh;
    left: 1.6vh;
  }
`

const bullet6 = css`
  animation-delay: -0.216s;
  &:after {
    top: 3.4vh;
    left: 1.2vh;
  }
`

const bullet7 = css`
  animation-delay: -0.252s;
  &:after {
    top: 3.15vh;
    left: 0.85vh;
  }
`

const bullet8 = css`
  animation-delay: -0.288s;
  &:after {
    top: 2.8vh;
    left: 0.6vh;
  }
`

export default LoadingSpinner