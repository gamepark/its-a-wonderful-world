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
  display: inline-block;
  position: relative;
  width: 8vh;
  height: 8vh;
  & > div {
    animation-name: ${keyframe};
    animation-duration: 1.2s;
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    animation-iteration-count: infinite;
    transform-origin: 4vh 4vh;
    &:after {
      content: " ";
      display: block;
      position: absolute;
      width: 0.7vh;
      height: 0.7vh;
      border-radius: 50%;
      background: #333;
      margin: -0.4vh 0 0 -0.4vh;
    }
  }
`

const bullet1 = css`
  animation-delay: -0.036s;
  &:after {
    top: 6.3vh;
    left: 6.3vh;
  }
`

const bullet2 = css`
  animation-delay: -0.072s;
  &:after {
    top: 6.8vh;
    left: 5.6vh;
  }
`

const bullet3 = css`
  animation-delay: -0.108s;
  &:after {
    top: 7.1vh;
    left: 4.8vh;
  }
`

const bullet4 = css`
  animation-delay: -0.144s;
  &:after {
    top: 7.2vh;
    left: 4vh;
  }
`

const bullet5 = css`
  animation-delay: -0.18s;
  &:after {
    top: 7.1vh;
    left: 3.2vh;
  }
`

const bullet6 = css`
  animation-delay: -0.216s;
  &:after {
    top: 6.8vh;
    left: 2.4vh;
  }
`

const bullet7 = css`
  animation-delay: -0.252s;
  &:after {
    top: 6.3vh;
    left: 1.7vh;
  }
`

const bullet8 = css`
  animation-delay: -0.288s;
  &:after {
    top: 5.6vh;
    left: 1.2vh;
  }
`

export default LoadingSpinner