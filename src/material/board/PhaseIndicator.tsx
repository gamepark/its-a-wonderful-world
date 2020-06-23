import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Phase from '../../types/Phase'
import {headerHeight} from '../../util/Styles'
import CircleBackgroundImage from './circle-metal.png'
import BlueBackgroundImage from './title-blue.png'
import GreyBackgroundImage from './title-grey.png'
import {roundTrackerX} from './RoundTracker'

const PhaseIndicator: FunctionComponent<{ phase: Phase }> = ({phase}) => {
  const {t} = useTranslation()
  return (
    <>
      <h3 css={[phaseStyle, draftStyle, phase === Phase.Draft && currentPhase]}>{t('Draft')}</h3>
      <h3 css={[phaseStyle, planningStyle, phase === Phase.Planning && currentPhase]}>{t('Planification')}</h3>
      <h3 css={[phaseStyle, productionStyle, phase === Phase.Production && currentPhase]}>{t('Production')}</h3>
    </>
  )
}

const phaseStyle = css`
  position: absolute;
  background-image: url(${GreyBackgroundImage});
  background-size: cover;
  padding: 0.4% 0 0.6% 0.5%;
  width: 8.2%;
  font-size: 1.3vh;
  color: white;
  text-transform: uppercase;
  text-align: center;
  font-weight: lighter;
  margin: 0;
  transform-origin: left;
  &:after {
    position: absolute;
    background-image: url(${CircleBackgroundImage});
    background-size: cover;
    font-size: 1.9vh;
    color: #888;
    top: -10%;
    left: -10%;
    width: 25%;
    height: 120%;
    padding: 7% 6% 6% 9%;
  }
`
const draftPhaseX = roundTrackerX + 6.6
const planningPhaseX = roundTrackerX + 6.8
const productionPhaseX = roundTrackerX + 6

const draftStyle = css`
  z-index: -1;
  left: ${draftPhaseX}%;
  top: ${headerHeight + 0.4}%;
  &:after {
    content: 'I';
  }
`

const planningStyle = css`
  z-index: -2;
  left: ${planningPhaseX}%;
  top: ${headerHeight + 4}%;
  &:after {
    content: 'II';
  }
`

const productionStyle = css`
  z-index: -3;
  left: ${productionPhaseX}%;
  top: ${headerHeight + 7.5}%;
  &:after {
    content: 'III';
  }
`

const currentPhase = css`
  z-index: 0;
  background-image: url(${BlueBackgroundImage});
  &:after {
    color: rgb(0, 107, 165);
  }
`

export default PhaseIndicator