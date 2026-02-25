/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Memory } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldMemory'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { useFocusContext, useGame, useLegalMove, usePlay, usePlayerName, usePlayerId, useRules } from '@gamepark/react-game'
import { isEndPlayerTurn, MaterialGame, MaterialMoveBuilder, MaterialRules } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'
import { getSupremacyWinners } from '../utils/getSupremacyWinners'
import arrowGreen from '../images/arrow-green.png'
import arrowWhite from '../images/arrow-white.png'
import boardCircleBlack from '../images/board-circle-black.png'
import boardCircleBlue from '../images/board-circle-blue.png'
import boardCircleGreen from '../images/board-circle-green.png'
import boardCircleGrey from '../images/board-circle-grey.png'
import boardCircleYellow from '../images/board-circle-yellow.png'
import financierGeneralOff from '../images/characters/financier-general-off.png'
import financierGeneralOn from '../images/characters/financier-general-on.png'
import financierOff from '../images/characters/financier-off.png'
import financierOn from '../images/characters/financier-on.png'
import generalOff from '../images/characters/general-off.png'
import generalOn from '../images/characters/general-on.png'

// Table boundaries (from GameDisplay)
const xMin = -37
const yMin = -19

// Board position in table coordinates (centered horizontally like draft/construction areas)
const boardX = 0
const boardY = -8

// Board dimensions (in em) - scaled to get 160px circles (adjusted from measured 133px)
const boardWidth = 55 * (160 / 204) * (160 / 133) // ~51.9em
const boardHeight = 12 * (160 / 204) * (160 / 133) // ~11.3em

// Resource circles (Materials, Energy, Science, Gold, Exploration)
const resourceCircles = [
  { image: boardCircleGrey, name: 'Materials', resource: Resource.Materials },
  { image: boardCircleBlack, name: 'Energy', resource: Resource.Energy },
  { image: boardCircleGreen, name: 'Science', resource: Resource.Science },
  { image: boardCircleYellow, name: 'Gold', resource: Resource.Gold },
  { image: boardCircleBlue, name: 'Exploration', resource: Resource.Exploration }
]

// Map RuleId to Resource for production phases
const ruleIdToResource: Record<number, Resource> = {
  [RuleId.ProductionMaterials]: Resource.Materials,
  [RuleId.ProductionEnergy]: Resource.Energy,
  [RuleId.ProductionScience]: Resource.Science,
  [RuleId.ProductionGold]: Resource.Gold,
  [RuleId.ProductionExploration]: Resource.Exploration
}

// Map resources to their production RuleId (for help dialogs)
const resourceToRuleId: Record<Resource, RuleId> = {
  [Resource.Materials]: RuleId.ProductionMaterials,
  [Resource.Energy]: RuleId.ProductionEnergy,
  [Resource.Science]: RuleId.ProductionScience,
  [Resource.Gold]: RuleId.ProductionGold,
  [Resource.Exploration]: RuleId.ProductionExploration,
  [Resource.Krystallium]: RuleId.ProductionMaterials // Not used but required for type
}

// Map resources to their character images
const resourceCharacterOn: Record<Resource, string> = {
  [Resource.Materials]: financierOn,
  [Resource.Energy]: generalOn,
  [Resource.Science]: financierGeneralOn,
  [Resource.Gold]: financierOn,
  [Resource.Exploration]: generalOn,
  [Resource.Krystallium]: financierOn // Not used but required for type
}

const resourceCharacterOff: Record<Resource, string> = {
  [Resource.Materials]: financierOff,
  [Resource.Energy]: generalOff,
  [Resource.Science]: financierGeneralOff,
  [Resource.Gold]: financierOff,
  [Resource.Exploration]: generalOff,
  [Resource.Krystallium]: financierOff // Not used but required for type
}

function useSupremacyHelpText(resource: Resource): string {
  const { t } = useTranslation()
  const game = useGame<MaterialGame>()
  const winners = game ? getSupremacyWinners(game, resource) : []
  const name0 = usePlayerName(winners[0])
  const name1 = usePlayerName(winners[1])

  if (winners.length === 0) {
    return t('help.production.status.nobody', 'Actuellement, personne ne remporterait le bonus (aucune production ou égalité).')
  }
  if (winners.length === 1) {
    return t('help.production.status.winner', '{player} remporterait le bonus.', { player: name0 })
  }
  return t('help.production.status.winners', '{player1} et {player2} remporteraient le bonus.', { player1: name0, player2: name1 })
}

function ResourceCircle({ image, name, resource }: { image: string; name: string; resource: Resource }) {
  const play = usePlay()
  const helpText = useSupremacyHelpText(resource)
  const game = useGame<MaterialGame>()
  const playerId = usePlayerId<Empire>()
  const winners = game ? getSupremacyWinners(game, resource) : []
  const hasMostProduction = playerId !== undefined && winners.includes(playerId)

  return (
    <div css={circleContainerStyle}>
      <img
        src={hasMostProduction ? resourceCharacterOn[resource] : resourceCharacterOff[resource]}
        alt={helpText}
        title={helpText}
        css={characterStyle}
        onClick={() => play(MaterialMoveBuilder.displayRulesHelp(resourceToRuleId[resource]), { transient: true })}
      />
      <div
        css={circleStyle}
        style={{ backgroundImage: `url(${image})` }}
        title={name}
        onClick={() => play(MaterialMoveBuilder.displayRulesHelp(resourceToRuleId[resource]), { transient: true })}
      />
    </div>
  )
}

export const Board = () => {
  const { t } = useTranslation()
  const rules = useRules<MaterialRules>()
  const ruleId = rules?.game.rule?.id as RuleId | undefined
  const round = rules?.remind(Memory.Round) ?? 1

  // Determine phases
  const isDraftPhase = ruleId !== undefined && ruleId < RuleId.Planning

  // Board is reduced size only during draft phase rounds 2+
  const isReducedSize = isDraftPhase && round > 1

  // Current production resource (if in production phase)
  const currentProductionResource = ruleId !== undefined ? ruleIdToResource[ruleId] : undefined

  // End turn move for validation
  const endTurn = useLegalMove(isEndPlayerTurn)
  const play = usePlay()
  const { focus } = useFocusContext()
  const playDown = focus?.highlight === true

  return (
    <div css={[containerStyle, isReducedSize && reducedSizeStyle, playDown && playDownStyle]}>
      {resourceCircles.map((resourceData) => (
        <ResourceCircle key={resourceData.name} {...resourceData} />
      ))}
      {resourceCircles.map((resourceData, index) => {
        const isActive = currentProductionResource === resourceData.resource && endTurn !== undefined
        return (
          <button
            key={`arrow-${resourceData.name}`}
            css={[arrowStyle(index), isActive && arrowActiveStyle]}
            disabled={!isActive}
            onClick={() => isActive && play(endTurn)}
            title={t('Validate', { ns: 'common' })}
          />
        )
      })}
    </div>
  )
}

// v2 ratios: circle width 15%, arrow width 5%, spacing 20% per resource
// So arrow is 1/3 of circle width, and gap between circles is 5%
const circleWidthPercent = 15
const spacingPercent = 20 // each resource takes 20% (15% circle + 5% gap)

const containerStyle = css`
  position: absolute;
  left: ${boardX - xMin}em;
  top: ${boardY - yMin}em;
  width: ${boardWidth}em;
  height: ${boardHeight}em;
  display: flex;
  justify-content: flex-start;
  transform: translate(-50%, -50%);
  transition: transform 0.5s ease-in-out;
`

const reducedSizeStyle = css`
  transform: translate(-50%, -50%) translate(13em, -8.5em) scale(0.5);
`

const playDownStyle = css`
  filter: brightness(0.5);
`

const circleContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: ${spacingPercent}%;
  height: 100%;
  position: relative;
`

const characterStyle = css`
  position: absolute;
  z-index: 1;
  top: 13%;
  left: 25%;
  width: 25%;
  pointer-events: auto;
  filter: drop-shadow(0.1em 0.1em 0.3em rgba(0, 0, 0, 0.7));
  cursor: pointer;
`

const circleStyle = css`
  width: ${(circleWidthPercent / spacingPercent) * 100}%;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  filter: drop-shadow(0.1em 0.1em 0.5em black);
  cursor: pointer;
`

const pulse = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.4);
  }
`

// v2: arrow width 5% (1/3 of circle), height 32% (vs circle 86%, so ~37% ratio)
// Arrow positioned at left: resourcePosition + 15% (right after circle)
const arrowWidthPercent = 5
const arrowHeightPercent = 32

const arrowStyle = (index: number) => css`
  position: absolute;
  left: ${circleWidthPercent + index * spacingPercent}%;
  top: 35%;
  width: ${arrowWidthPercent}%;
  height: ${arrowHeightPercent}%;
  background-image: url(${arrowWhite});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  filter: drop-shadow(0.1em 0.1em 0.3em black);
  transition: opacity 0.3s ease-in-out;
  cursor: default;
  opacity: 0.6;
  transform-origin: center center;

  &:focus {
    outline: none;
  }
`

const arrowActiveStyle = css`
  background-image: url(${arrowGreen});
  opacity: 1;
  cursor: pointer;
  animation: ${pulse} 0.8s linear alternate infinite;
`
