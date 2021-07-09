/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {useTranslation} from 'react-i18next'
import {areasX, cardWidth, headerHeight} from '../../util/Styles'
import {drawPileScale} from '../developments/DrawPile'
import Images from '../Images'

type Props = { round: number }

export default function RoundTracker({round}: Props) {
  const {t} = useTranslation()
  return (
    <>
      <img alt={t('Round-tracker token')} src={round % 2 ? Images.roundTrackerRecto : Images.roundTrackerVerso} draggable="false" css={roundTrackerStyle}/>
      <span css={roundTextStyle}>{round}</span>
    </>
  )
}

export const roundTrackerX = areasX + 3 * cardWidth * drawPileScale + 5

const roundTrackerStyle = css`
  position: absolute;
  z-index: 1;
  height: 10.5%;
  top: ${headerHeight + 0.5}%;
  left: ${roundTrackerX}%;
  filter: drop-shadow(0.1em 0.1em 0.4em black);
`

const roundTextStyle = css`
  position: absolute;
  z-index: 2;
  top: 10.3%;
  left: ${roundTrackerX + 2.2}%;
  font-size: 4em;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black;
`