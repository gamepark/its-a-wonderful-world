/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { CustomMoveType } from '@gamepark/its-a-wonderful-world/material/CustomMoveType'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { useLegalMove, usePlay, usePlayerId, useRules } from '@gamepark/react-game'
import { isCustomMoveType, MaterialRules } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'

export const PlanningButtons = () => {
  const { t } = useTranslation()
  const rules = useRules<MaterialRules>()
  const play = usePlay()
  const playerId = usePlayerId<Empire>()

  const ruleId = rules?.game.rule?.id as RuleId | undefined
  const isPlanningPhase = ruleId === RuleId.Planning

  // Get legal custom moves
  const slateAllMove = useLegalMove(isCustomMoveType(CustomMoveType.SlateAllForConstruction))
  const recycleAllMove = useLegalMove(isCustomMoveType(CustomMoveType.RecycleAll))

  // Only show buttons during planning phase when moves are available, and when viewing own board
  const viewingOtherPlayer = rules?.game.view !== undefined && rules.game.view !== playerId
  if (!isPlanningPhase || viewingOtherPlayer || (!slateAllMove && !recycleAllMove)) {
    return null
  }

  return (
    <div css={containerStyle}>
      <button
        css={buttonStyle}
        onClick={() => slateAllMove && play(slateAllMove)}
        disabled={!slateAllMove}
      >
        <span css={borderContainerStyle}>
          <span /><span /><span /><span />
        </span>
        {t('Build all')}
      </button>
      <button
        css={buttonStyle}
        onClick={() => recycleAllMove && play(recycleAllMove)}
        disabled={!recycleAllMove}
      >
        <span css={borderContainerStyle}>
          <span /><span /><span /><span />
        </span>
        {t('Recycle all')}
      </button>
    </div>
  )
}

// Position matching V2: top: 11%, centered between left content and player panel
const containerStyle = css`
  position: absolute;
  top: 1.7em;
  left: 36em;
  display: flex;
  justify-content: center;
  gap: 1em;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
