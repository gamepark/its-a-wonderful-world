/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { useFocusContext, useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'
import circleMetal from '../images/circle-metal.png'
import titleBlue from '../images/title-blue.png'
import titleGrey from '../images/title-grey.png'

// Table boundaries (from GameDisplay)
const xMin = -37
const yMin = -18.5

// Position in table coordinates (to the right of RoundTracker at x=-10)
const baseX = -8.8
const baseY = -17.8

enum Phase {
  Draft = 'Draft',
  Planning = 'Planning',
  Production = 'Production'
}

const getPhaseFromRuleId = (ruleId?: RuleId): Phase => {
  if (ruleId === undefined) return Phase.Draft
  if (ruleId >= RuleId.MaterialsProduction) return Phase.Production
  if (ruleId >= RuleId.Planning) return Phase.Planning
  return Phase.Draft
}

export const PhaseIndicator = () => {
  const { t } = useTranslation()
  const rules = useRules<MaterialRules>()
  const ruleId = rules?.game.rule?.id as RuleId | undefined
  const phase = getPhaseFromRuleId(ruleId)
  const { focus } = useFocusContext()
  const playDown = focus?.highlight === true

  return (
    <div css={[containerStyle, playDown && playDownStyle]}>
      <div css={[phaseStyle, draftStyle, phase === Phase.Draft && currentPhase]}><span>{t('Draft')}</span></div>
      <div css={[phaseStyle, planningStyle, phase === Phase.Planning && currentPhase]}><span>{t('Planning')}</span></div>
      <div css={[phaseStyle, productionStyle, phase === Phase.Production && currentPhase]}><span>{t('Production')}</span></div>
    </div>
  )
}

const playDownStyle = css`
  filter: brightness(0.5);
`

const containerStyle = css`
  position: absolute;
  left: ${baseX - xMin}em;
  top: ${baseY - yMin}em;
  transform: translate(-50%, -50%);
`

const phaseStyle = css`
  position: absolute;
  background-image: url(${titleGrey});
  background-size: cover;
  padding: 0.15em 0 0.25em 0.2em;
  width: 8em;
  font-size: 0.8em;
  color: white;
  text-transform: uppercase;
  text-align: center;
  font-weight: lighter;
  margin: 0;
  transform-origin: left;

  &:after {
    position: absolute;
    background-image: url(${circleMetal});
    background-size: cover;
    font-size: 1em;
    color: #888;
    top: -10%;
    left: -10%;
    width: 25%;
    height: 120%;
    padding: 7% 6% 6% 8%;
  }
  
  > span {
    font-size: 0.7em;
  }
`

const draftStyle = css`
  z-index: -1;
  left: 0;
  top: 0;

  &:after {
    content: 'I';
  }
`

const planningStyle = css`
  z-index: -2;
  left: 0.2em;
  top: 1.8em;

  &:after {
    content: 'II';
  }
`

const productionStyle = css`
  z-index: -3;
  left: -0.4em;
  top: 3.6em;

  &:after {
    content: 'III';
  }
`

const currentPhase = css`
  z-index: 0;
  background-image: url(${titleBlue});

  &:after {
    color: rgb(0, 107, 165);
  }
`
