/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { DropAreaDescription, ItemContext, ListLocator, MaterialContext, useMaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'

// Card dimensions (same as DevelopmentCardDescription)
const cardWidth = 6.5
const cardHeight = 10

// Number of cards to draft per round (base game)
const numberOfCardsToDraft = 7

// Full width max count for 2 players (up to 10 cards at full gap, 11-12 compress)
const fullWidthMaxCount = 9

// Area styling constants (from v2)
const areaBorderWidth = 0.1 // Thinner border
const areaPadding = 0.7 // Padding around cards (top/bottom and left/right)
const areasCardMargin = 1

// Width calculations
const normalWidth = (cardWidth + areasCardMargin) * numberOfCardsToDraft - areasCardMargin + areaPadding * 2
const fullWidth = (cardWidth + areasCardMargin) * fullWidthMaxCount - areasCardMargin + areaPadding * 2

class DraftAreaLocator extends ListLocator<Empire, MaterialType, LocationType> {
  gap = { x: cardWidth + areasCardMargin }

  /**
   * With 2 players, the draft area is wider (v2: fullWidth = game.players.length === 2).
   * Up to 10 cards at full gap; 11-12 cards (Ascension + 2p) compress automatically.
   */
  getMaxCount(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    return context.rules.players.length === 2 ? fullWidthMaxCount : numberOfCardsToDraft
  }

  // Return locations to display (even when empty) - this creates the static drop area
  getLocations(context: MaterialContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    if (currentView === undefined) return []
    return [{ type: LocationType.DraftArea, player: currentView }]
  }

  hide(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return item.location.player !== currentView
  }

  getCoordinates(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    // During Planning and Production phases, position draft area lower (1em above table bottom)
    // Table yMax = 22, card height = 10, padding = 0.7*2, so center at yMax - 1 - height/2
    const ruleId = context.rules.game.rule?.id as RuleId | undefined
    const isDraftPhase = ruleId !== undefined && ruleId < RuleId.Planning

    if (isDraftPhase) {
      // During draft phase, keep original position
      return { x: -22, y: 4.5, z: 1 }
    } else {
      // Draft area at bottom: yMax(22) - 1em margin - half height (5.7) ≈ 15
      return { x: -22, y: 15.5, z: 1 }
    }
  }

  locationDescription = new DraftAreaDescription()
}

class DraftAreaDescription extends DropAreaDescription<Empire, MaterialType, LocationType> {
  // Default width fits 7 cards
  width = normalWidth
  // Height = card height + padding top and bottom
  height = cardHeight + areaPadding * 2
  borderRadius = 0.7

  /**
   * With 2 players, the area background is wider (v2: fullWidth = game.players.length === 2)
   */
  getLocationSize(location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    const baseSize = super.getLocationSize(location, context)
    if (context.rules.players.length === 2) {
      return { width: fullWidth, height: baseSize.height }
    }
    return baseSize
  }

  extraCss = css`
    background-color: rgba(175, 202, 11, 0.1);
    border: ${areaBorderWidth}em solid #afca0b;
    box-shadow: 0 0 0.3em #afca0b;
  `

  // Text shown when the area is empty
  content = DraftAreaContent
}

const DraftAreaContent = () => {
  const { t } = useTranslation()
  const context = useMaterialContext<Empire, MaterialType, LocationType>()
  const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
  const cardsInDraft = context.rules.material(MaterialType.DevelopmentCard)
    .location(LocationType.DraftArea)
    .player(currentView)
    .length

  if (cardsInDraft > 0) return null

  return (
    <span css={draftAreaTextStyle}>
      {t('Draft area')}
    </span>
  )
}

const draftAreaTextStyle = css`
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  text-align: center;
  font-size: 2em;
  color: #afca0b;
  pointer-events: none;
`

export const draftAreaLocator = new DraftAreaLocator()
