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
  width: 80px;
  height: 80px;
  & > div {
    animation-name: ${keyframe};
    animation-duration: 1.2s;
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    animation-iteration-count: infinite;
    transform-origin: 40px 40px;
    &:after {
      content: " ";
      display: block;
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #333;
      margin: -4px 0 0 -4px;
    }
  }
`

const bullet1 = css`
  animation-delay: -0.036s;
  &:after {
    top: 63px;
    left: 63px;
  }
`

const bullet2 = css`
  animation-delay: -0.072s;
  &:after {
    top: 68px;
    left: 56px;
  }
`

const bullet3 = css`
  animation-delay: -0.108s;
  &:after {
    top: 71px;
    left: 48px;
  }
`

const bullet4 = css`
  animation-delay: -0.144s;
  &:after {
    top: 72px;
    left: 40px;
  }
`

const bullet5 = css`
  animation-delay: -0.18s;
  &:after {
    top: 71px;
    left: 32px;
  }
`

const bullet6 = css`
  animation-delay: -0.216s;
  &:after {
    top: 68px;
    left: 24px;
  }
`

const bullet7 = css`
  animation-delay: -0.252s;
  &:after {
    top: 63px;
    left: 17px;
  }
`

const bullet8 = css`
  animation-delay: -0.288s;
  &:after {
    top: 56px;
    left: 12px;
  }
`

export default LoadingSpinner