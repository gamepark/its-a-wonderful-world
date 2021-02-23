import {css} from '@emotion/core'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {headerHeight} from '../../util/Styles'
import Images from '../Images'
import {roundTrackerX} from './RoundTracker'

const PhaseIndicator: FunctionComponent<{ phase: Phase }> = ({phase}) => {
  const {t} = useTranslation()
  return (
    <>
      <h3 css={[phaseStyle, draftStyle, phase === Phase.Draft && currentPhase]}>{t('Draft')}</h3>
      <h3 css={[phaseStyle, planningStyle, phase === Phase.Planning && currentPhase]}>{t('Planning')}</h3>
      <h3 css={[phaseStyle, productionStyle, phase === Phase.Production && currentPhase]}>{t('Production')}</h3>
    </>
  )
}

const phaseStyle = css`
  position: absolute;
  background-image: url(${Images.titleGrey});
  background-size: cover;
  padding: 0.4% 0 0.6% 0.5%;
  width: 8.2%;
  font-size: 1.3em;
  color: white;
  text-transform: uppercase;
  text-align: center;
  font-weight: lighter;
  margin: 0;
  transform-origin: left;

  &:after {
    position: absolute;
    background-image: url(${Images.circleMetal});
    background-size: cover;
    font-size: 1.6em;
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
  background-image: url(${Images.titleBlue});

  &:after {
    color: rgb(0, 107, 165);
  }
`

export default PhaseIndicator