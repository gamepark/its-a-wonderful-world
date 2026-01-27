/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Memory } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldMemory'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { DropAreaDescription, ItemContext, ListLocator, MaterialContext, useMaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'

// Card dimensions (same as DevelopmentCardDescription)
const cardWidth = 6.5
const cardHeight = 10

// Area styling constants (from v2)
const areaBorderWidth = 0.1 // Thinner border
const areaPadding = 0.7 // Padding around cards
const areasCardMargin = 1

// Number of cards that can fit in construction area (base)
const maxConstructionCards = 7

// Full width max count for 2 players
const fullWidthMaxCount = 9

// Width calculations
const normalWidth = (cardWidth + areasCardMargin) * maxConstructionCards - areasCardMargin + areaPadding * 2
const fullWidth = (cardWidth + areasCardMargin) * fullWidthMaxCount - areasCardMargin + areaPadding * 2

/**
 * Helper to check if the game is in draft phase
 */
function isDraftPhase(context: MaterialContext<Empire, MaterialType, LocationType>): boolean {
  const ruleId = context.rules.game.rule?.id as RuleId | undefined
  return ruleId !== undefined && ruleId < RuleId.Planning
}

class ConstructionAreaLocator extends ListLocator<Empire, MaterialType, LocationType> {
  gap = { x: cardWidth + areasCardMargin }

  /**
   * With 2 players during planning/production, the construction area is wider
   * (v2: fullWidth = game.players.length === 2 && game.phase !== Phase.Draft)
   */
  getMaxCount(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    return context.rules.players.length === 2 && !isDraftPhase(context) ? fullWidthMaxCount : maxConstructionCards
  }

  // Return locations to display (even when empty) - this creates the static drop area
  getLocations(context: MaterialContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    if (currentView === undefined) return []

    // Hide construction area during draft round 1
    const ruleId = context.rules.game.rule?.id as RuleId | undefined
    const round = context.rules.remind(Memory.Round) ?? 1
    const isDraft = ruleId !== undefined && ruleId < RuleId.Planning
    if (isDraft && round === 1) return []

    return [{ type: LocationType.ConstructionArea, player: currentView }]
  }

  hide(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>): boolean {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return item.location.player !== currentView
  }

  getCoordinates(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    // During Planning and Production phases, position construction area above draft area
    if (isDraftPhase(context)) {
      // During draft phase, keep original position
      return { x: -22, y: -7.5, z: 1 }
    } else {
      // Draft area is at y=15.5, construction area above it (card height 10 + padding + margin)
      return { x: -22, y: 3.5, z: 1 }
    }
  }

  locationDescription = new ConstructionAreaDescription()
}

class ConstructionAreaDescription extends DropAreaDescription<Empire, MaterialType, LocationType> {
  // Default width fits 7 cards
  width = normalWidth
  // Height = card height + padding top and bottom
  height = cardHeight + areaPadding * 2
  borderRadius = 0.7

  /**
   * With 2 players during planning/production, the area background is wider
   * (v2: fullWidth = game.players.length === 2 && game.phase !== Phase.Draft)
   */
  getLocationSize(location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    const baseSize = super.getLocationSize(location, context)
    if (context.rules.players.length === 2 && !isDraftPhase(context)) {
      return { width: fullWidth, height: baseSize.height }
    }
    return baseSize
  }

  extraCss = css`
    background-color: rgba(247, 166, 0, 0.1);
    border: ${areaBorderWidth}em solid #f7a600;
    box-shadow: 0 0 0.3em #f7a600;
  `

  // Text shown when the area is empty
  content = ConstructionAreaContent
}

const ConstructionAreaContent = () => {
  const { t } = useTranslation()
  const context = useMaterialContext<Empire, MaterialType, LocationType>()
  const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
  const cardsInConstruction = context.rules.material(MaterialType.DevelopmentCard)
    .location(LocationType.ConstructionArea)
    .player(currentView)
    .length

  if (cardsInConstruction > 0) return null

  return (
    <span css={constructionAreaTextStyle}>
      {t('Construction area')}
    </span>
  )
}

const constructionAreaTextStyle = css`
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  text-align: center;
  font-size: 2em;
  color: #f7a600;
  pointer-events: none;
`

export const constructionAreaLocator = new ConstructionAreaLocator()
