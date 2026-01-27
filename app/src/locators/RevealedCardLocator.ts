import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { getRelativePlayerIndex, Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

// Panel layout constants (must match OnPlayerPanelLocator.ts)
const playerPanelWidth = 15
const playerPanelHeight = (players: number) => (players > 5 ? 5 : 7.3)
const playerPanelMargin = 0.65
const playerPanelRightMargin = 0.8

// Table boundaries (from GameDisplay.tsx)
const tableXMax = 45
const tableYMin = -18.5

// Card dimensions
const cardWidth = 6.5

/**
 * Animation-only locator: positions a card at full size just to the left of a player's panel.
 * Used as a waypoint during the reveal animation so opponents can see the drafted card.
 */
class RevealedCardLocator extends Locator<Empire, MaterialType, LocationType> {
  getCoordinates(location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    const panelIndex = getRelativePlayerIndex(context, location.player!)
    const height = playerPanelHeight(context.rules.players.length)

    // Card positioned just to the left of the panel
    const panelLeftEdge = tableXMax - playerPanelRightMargin - playerPanelWidth
    const x = panelLeftEdge - 0.5 - cardWidth / 2

    // Same Y as panel center
    const panelTop = playerPanelMargin + panelIndex * (height + playerPanelMargin)
    const y = tableYMin + panelTop + height / 2

    return { x, y, z: 15 }
  }
}

export const revealedCardLocator = new RevealedCardLocator()
