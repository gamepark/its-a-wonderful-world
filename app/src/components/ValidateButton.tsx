/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { useLegalMove, usePlay, useRules } from '@gamepark/react-game'
import { isEndPlayerTurn, MaterialRules } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'

const validateRules = [
  RuleId.Planning,
  RuleId.MaterialsProduction,
  RuleId.EnergyProduction,
  RuleId.ScienceProduction,
  RuleId.GoldProduction,
  RuleId.ExplorationProduction
]

export const ValidateButton = () => {
  const { t } = useTranslation()
  const rules = useRules<MaterialRules>()
  const play = usePlay()

  const ruleId = rules?.game.rule?.id as RuleId | undefined
  const showValidate = ruleId !== undefined && validateRules.includes(ruleId)

  const endTurnMove = useLegalMove(isEndPlayerTurn)

  if (!showValidate || !endTurnMove) {
    return null
  }

  return (
    <div css={containerStyle}>
      <button
        css={buttonStyle}
        onClick={() => play(endTurnMove)}
      >
        <span css={borderContainerStyle}>
          <span /><span /><span /><span />
        </span>
        {t('Validate', { ns: 'common' })}
      </button>
    </div>
  )
}

const containerStyle = css`
  position: absolute;
  top: 1.7em;
  left: 36em;
  display: flex;
  justify-content: center;
  z-index: 10;
`

// Animated border keyframes
const animateTop = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`

const animateRight = keyframes`
  0% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
`

const animateBottom = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

const animateLeft = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`

const buttonStyle = css`
  position: relative;
  font-size: 1.5em;
  background: linear-gradient(-30deg, #0b3d3d 50%, #082b2b 50%);
  padding: 0.2em 0.4em;
  margin: 0;
  cursor: pointer;
  color: #d4f7f7;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
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
    transition: .2s opacity ease-in-out;
  }

  &:hover:before {
    opacity: 0.2;
  }
`

const borderContainerStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;

  & > span {
    position: absolute;
  }

  & > span:nth-of-type(1) {
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to left, rgba(8, 43, 43, 0), #26d9d9);
    animation: 2s ${animateTop} linear infinite;
  }

  & > span:nth-of-type(2) {
    top: 0;
    right: 0;
    height: 100%;
    width: 2px;
    background: linear-gradient(to top, rgba(8, 43, 43, 0), #26d9d9);
    animation: 2s ${animateRight} linear -1s infinite;
  }

  & > span:nth-of-type(3) {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, rgba(8, 43, 43, 0), #26d9d9);
    animation: 2s ${animateBottom} linear infinite;
  }

  & > span:nth-of-type(4) {
    top: 0;
    left: 0;
    height: 100%;
    width: 2px;
    background: linear-gradient(to bottom, rgba(8, 43, 43, 0), #26d9d9);
    animation: 2s ${animateLeft} linear -1s infinite;
  }
`
