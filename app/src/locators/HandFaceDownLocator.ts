import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { playerHandLocator } from './PlayerHandLocator'

/**
 * Animation-only locator: positions cards gathered at the center of the hand area, face down.
 * Used as a waypoint during pass cards animation.
 * Uses location.x (passed from waypoint) as list index for z-stacking via gap.
 */
class HandFaceDownLocator extends ListLocator<Empire, MaterialType, LocationType> {
  getGap(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>): Partial<Coordinates> {
    const viewedPlayer = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return context.player === viewedPlayer ? { z: -0.05 } : { z: 0.05 }
  }

  getCoordinates(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    return playerHandLocator.getCoordinates(_location, context)
  }

  placeItem(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>): string[] {
    return [...super.placeItem(item, context), 'rotateY(180deg)']
  }
}

export const handFaceDownLocator = new HandFaceDownLocator()
