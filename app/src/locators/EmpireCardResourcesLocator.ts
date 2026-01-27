import { DropAreaDescription, ItemContext, Locator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { empireCardDescription } from '../material/EmpireCardDescription'

// Empire card position (from EmpireCardSpaceLocator)
const empireCardX = -30.5
const empireCardY = 14.5

// Star pattern positions for resources on empire card (from V2)
// Each position is [left%, top%] on the card
const resourcePosition = [
  [29, 60],
  [15, 60],
  [10, 45],
  [22, 36],
  [34, 45]
]

/**
 * Locator for non-krystallium resources on the empire card.
 * Resources are placed in a star pattern on the empire card.
 */
class EmpireCardResourcesLocator extends Locator<Empire, MaterialType, LocationType> {
  locationDescription = new DropAreaDescription(empireCardDescription)

  /**
   * Return the location for the current player to create the drop area
   */
  getLocations(context: MaterialContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    if (currentView === undefined) return []
    return [{ type: LocationType.EmpireCardResources, player: currentView }]
  }

  /**
   * Position the drop area at the empire card location
   */
  getCoordinates(_location: Location<Empire, LocationType>, _context: MaterialContext<Empire, MaterialType, LocationType>) {
    return { x: empireCardX, y: empireCardY, z: 0 }
  }

  hide(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return item.location.player !== currentView
  }

  /**
   * Position resources in a star pattern on the empire card using absolute coordinates
   */
  getItemCoordinates(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>): Coordinates {
    const player = item.location.player

    // Get all resources on empire card for this player
    const allResources = context.rules.material(MaterialType.ResourceCube)
      .location(LocationType.EmpireCardResources)
      .player(player)
      .getItems()

    // Find the index of this specific item
    const itemIndex = allResources.findIndex(
      (r) => r === item || (r.location.x === item.location.x && r.location.y === item.location.y && r.id === item.id)
    )

    // Get position in star pattern (cycles through 5 positions)
    const positionIndex = (itemIndex >= 0 ? itemIndex : 0) % 5
    const [leftPercent, topPercent] = resourcePosition[positionIndex]

    // Convert percentage position on card to absolute coordinates
    // Card position is at center, so we need to offset from top-left corner
    const x = empireCardX - empireCardDescription.width / 2 + (leftPercent / 100) * empireCardDescription.width
    const y = empireCardY - empireCardDescription.height / 2 + (topPercent / 100) * empireCardDescription.height

    return { x, y, z: 5 + itemIndex * 0.1 }
  }
}

export const empireCardResourcesLocator = new EmpireCardResourcesLocator()
