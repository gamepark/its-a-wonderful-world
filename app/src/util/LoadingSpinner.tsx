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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const style = css`
  width: 4em;
  height: 4em;

  & > div {
    animation-name: ${keyframe};
    animation-duration: 1.2s;
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    animation-iteration-count: infinite;
    transform-origin: 2em 2em;

    &:after {
      content: " ";
      display: block;
      position: absolute;
      width: 0.35em;
      height: 0.35em;
      border-radius: 50%;
      background: #EEE;
      margin: -0.2em 0 0 -0.2em;
    }
  }
`

const bullet1 = css`
  animation-delay: -0.036s;

  &:after {
    top: 3.15em;
    left: 3.15em;
  }
`

const bullet2 = css`
  animation-delay: -0.072s;

  &:after {
    top: 3.4em;
    left: 2.8em;
  }
`

const bullet3 = css`
  animation-delay: -0.108s;

  &:after {
    top: 3.55em;
    left: 2.4em;
  }
`

const bullet4 = css`
  animation-delay: -0.144s;

  &:after {
    top: 3.6em;
    left: 2em;
  }
`

const bullet5 = css`
  animation-delay: -0.18s;

  &:after {
    top: 3.55em;
    left: 1.6em;
  }
`

const bullet6 = css`
  animation-delay: -0.216s;

  &:after {
    top: 3.4em;
    left: 1.2em;
  }
`

const bullet7 = css`
  animation-delay: -0.252s;

  &:after {
    top: 3.15em;
    left: 0.85em;
  }
`

const bullet8 = css`
  animation-delay: -0.288s;

  &:after {
    top: 2.8em;
    left: 0.6em;
  }
`

export default LoadingSpinner