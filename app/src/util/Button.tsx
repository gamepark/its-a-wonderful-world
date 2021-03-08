/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {ButtonHTMLAttributes, FunctionComponent} from 'react'

const Button: FunctionComponent<ButtonHTMLAttributes<HTMLButtonElement>> = ({children, ...props}) => {
  return <button css={style} {...props}><span/><span/><span/><span/>{children}</button>
}

const animateTop = keyframes`
  0% {
    -webkit-transform: translateX(100%);
            transform: translateX(100%);
  }
  100% {
    -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
  }
`

const animateRight = keyframes`
  0% {
    -webkit-transform: translateY(100%);
            transform: translateY(100%);
  }
  100% {
    -webkit-transform: translateY(-100%);
            transform: translateY(-100%);
  }
`

const animateBottom = keyframes`
  0% {
    -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
  }
  100% {
    -webkit-transform: translateX(100%);
            transform: translateX(100%);
  }
`

const animateLeft = keyframes`
  0% {
    -webkit-transform: translateY(-100%);
            transform: translateY(-100%);
  }
  100% {
    -webkit-transform: translateY(100%);
            transform: translateY(100%);
  }
`

const style = css`
  background: linear-gradient(-30deg, #0b3d3d 50%, #082b2b 50%);
  padding: 0.2em 0.4em;
  margin: 0;
  display: inline-block;
  -webkit-transform: translate(0%, 0%);
  transform: translate(0%, 0%);
  cursor: pointer;
  overflow: hidden;
  color: #d4f7f7;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  -webkit-box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  outline: 0;
  border-style: none;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #85adad;
    opacity: 0;
    -webkit-transition: .2s opacity ease-in-out;
    transition: .2s opacity ease-in-out;
  }

  &:hover:before {
    opacity: 0.2;
  }

  & > span {
    position: absolute;
  }

  & > span:nth-of-type(1) {
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: -webkit-gradient(linear, right top, left top, from(rgba(8, 43, 43, 0)), to(#26d9d9));
    background: linear-gradient(to left, rgba(8, 43, 43, 0), #26d9d9);
    -webkit-animation: 2s ${animateTop} linear infinite;
            animation: 2s ${animateTop} linear infinite;
  }

  & > span:nth-of-type(2) {
    top: 0;
    right: 0;
    height: 100%;
    width: 2px;
    background: -webkit-gradient(linear, left bottom, left top, from(rgba(8, 43, 43, 0)), to(#26d9d9));
    background: linear-gradient(to top, rgba(8, 43, 43, 0), #26d9d9);
    -webkit-animation: 2s ${animateRight} linear -1s infinite;
            animation: 2s ${animateRight} linear -1s infinite;
  }

  & > span:nth-of-type(3) {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: -webkit-gradient(linear, left top, right top, from(rgba(8, 43, 43, 0)), to(#26d9d9));
    background: linear-gradient(to right, rgba(8, 43, 43, 0), #26d9d9);
    -webkit-animation: 2s ${animateBottom} linear infinite;
    animation: 2s ${animateBottom} linear infinite;
  }

  & >  span:nth-of-type(4) {
    top: 0;
    left: 0;
    height: 100%;
    width: 2px;
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(8, 43, 43, 0)), to(#26d9d9));
    background: linear-gradient(to bottom, rgba(8, 43, 43, 0), #26d9d9);
    -webkit-animation: 2s ${animateLeft} linear -1s infinite;
    animation: 2s ${animateLeft} linear -1s infinite;
  }
`

export default Button