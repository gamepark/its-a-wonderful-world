import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { getRelativePlayerIndex, ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'

// Panel layout constants (must match PlayerPanels.tsx)
const playerPanelWidth = 15
const playerPanelHeight = (players: number) => (players > 5 ? 5 : 7.3)
const playerPanelMargin = 0.65
const playerPanelRightMargin = 0.8

// Table boundaries (from GameDisplay.tsx)
const tableXMax = 45
const tableYMin = -18.5

/**
 * Animation-only locator: positions cards at a player's panel with small scale.
 * Used as a waypoint during pass cards animation.
 * Uses location.x (passed from waypoint) as list index for z-stacking via gap.
 */
class OnPlayerPanelLocator extends ListLocator<Empire, MaterialType, LocationType> {
  getGap(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>): Partial<Coordinates> {
    const viewedPlayer = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return context.player === viewedPlayer ? { z: -0.05 } : { z: 0.05 }
  }

  getCoordinates(location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    const panelIndex = getRelativePlayerIndex(context, location.player!)
    const height = playerPanelHeight(context.rules.players.length)

    // Panel center X in table coordinates
    const x = tableXMax - playerPanelRightMargin - playerPanelWidth / 2

    // Panel center Y in table coordinates
    const panelTop = playerPanelMargin + panelIndex * (height + playerPanelMargin)
    const y = tableYMin + panelTop + height / 2

    return { x, y, z: 10 }
  }

  placeItem(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>): string[] {
    const transforms = [...super.placeItem(item, context)]
    if (item.location.rotation === true) {
      transforms.push('rotateY(180deg)')
    }
    transforms.push('scale(0.3)')
    return transforms
  }
}

export const onPlayerPanelLocator = new OnPlayerPanelLocator()
