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
  transition: left 0.5s ease-in-out, transform 0.5s ease-in-out;
`

const roundTextStyle = css`
  position: absolute;
  z-index: 2;
  top: 10.3%;
  left: 4.3%;
  font-size: 4vh;
  color: #333;
  font-weight: bold;
  text-shadow: #888 2px 0 10px;
  transition: opacity 0.5s ease-in-out;
`

export default RoundTracker