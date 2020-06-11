import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {constructedCardX, headerHeight} from '../../util/Styles'
import roundTracker1 from './round-tracker-1-3.png'
import roundTracker2 from './round-tracker-2-4.png'


const RoundTracker: FunctionComponent<{ round: number }> = ({round}) => {
  const {t} = useTranslation()
  return (
    <>
      <img alt={t('Le marqueur de tour')} src={round % 2 ? roundTracker1 : roundTracker2} draggable="false" css={roundTrackerStyle}/>
      <span css={roundTextStyle}>{round}</span>
    </>
  )
}

const roundTrackerStyle = css`
  position: absolute;
  z-index: 1;
  height: 10.5%;
  top: ${headerHeight + 0.5}%;
  left: ${constructedCardX}%;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
`

const roundTextStyle = css`
  position: absolute;
  z-index: 2;
  top: 10.3%;
  left: 4%;
  font-size: 4vh;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 5px black, 0 0 5px black, 0 0 5px black, 0 0 5px black;
`

export default RoundTracker