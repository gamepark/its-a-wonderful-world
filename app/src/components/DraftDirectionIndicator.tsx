/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { FC, HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import arrowGreen from '../images/arrow-green.png'
import arrowWhite from '../images/arrow-white.png'

type Props = {
  clockwise: boolean
} & HTMLAttributes<HTMLDivElement>

/**
 * Shows animated arrows indicating the draft direction between player panels.
 * - Clockwise (odd rounds): green arrows pointing down
 * - Counter-clockwise (even rounds): white arrows pointing up
 */
export const DraftDirectionIndicator: FC<Props> = ({ clockwise, ...props }) => {
  const { t } = useTranslation()
  const arrowSrc = clockwise ? arrowGreen : arrowWhite

  return (
    <div
      css={[containerStyle, clockwise ? scrollDownAnimation : scrollUpAnimation]}
      title={t('Draft direction')}
      {...props}
    >
      <div css={sliderContent}>
        <img src={arrowSrc} alt="" css={[arrowStyle, clockwise ? arrowDown : arrowUp]} style={{ top: 0 }} />
        <img src={arrowSrc} alt="" css={[arrowStyle, clockwise ? arrowDown : arrowUp]} style={{ top: '25%' }} />
        <img src={arrowSrc} alt="" css={[arrowStyle, clockwise ? arrowDown : arrowUp]} style={{ top: '50%' }} />
        <img src={arrowSrc} alt="" css={[arrowStyle, clockwise ? arrowDown : arrowUp]} style={{ top: '75%' }} />
        <img src={arrowSrc} alt="" css={[arrowStyle, clockwise ? arrowDown : arrowUp]} style={{ top: '100%' }} />
      </div>
    </div>
  )
}

const containerStyle = css`
  position: absolute;
  width: 5em;
  height: 4em;
  overflow: hidden;
  pointer-events: none;
  filter: drop-shadow(0 0 0.3em rgba(0, 0, 0, 0.7));
`

const sliderContent = css`
  position: relative;
  width: 100%;
  height: 200%;
`

const arrowStyle = css`
  position: absolute;
  width: 100%;
  height: auto;
  transform: translateY(-50%);
  opacity: 0.9;
`

const arrowDown = css`
  transform: translateY(-50%) rotate(90deg);
`

const arrowUp = css`
  transform: translateY(-50%) rotate(-90deg);
`

const scrollDown = keyframes`
  from {
    transform: translateY(-50%);
  }
  to {
    transform: translateY(0%);
  }
`

const scrollDownAnimation = css`
  & > div {
    animation: ${scrollDown} 2s linear infinite;
  }
`

const scrollUp = keyframes`
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(-50%);
  }
`

const scrollUpAnimation = css`
  & > div {
    animation: ${scrollUp} 2s linear infinite;
  }
`
