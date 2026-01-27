import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { ItemContext, ListLocator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { empireCardDescription } from '../material/EmpireCardDescription'
import { resourceCubeDescription } from '../material/ResourceCubeDescription'
import { empireCardX, empireCardY, moveUpOffset, shouldMoveUpEmpire } from './EmpireCardSpaceLocator'

/**
 * Locator for krystallium cubes stacked vertically on the left side of the empire card.
 */
class KrystalliumStockLocator extends ListLocator<Empire, MaterialType, LocationType> {
  gap = { y: -0.7 }

  hide(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return item.location.player !== currentView
  }

  getCoordinates(_location: Location<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>) {
    // Position to the left of the empire card, stacked from bottom to top
    const cubeWidth = resourceCubeDescription.width
    const cubeHeight = resourceCubeDescription.height
    const x = empireCardX - empireCardDescription.width / 2 - cubeWidth * 1.2
    const baseY = empireCardY + empireCardDescription.height / 2 - cubeHeight
    const y = shouldMoveUpEmpire(context) ? baseY - moveUpOffset : baseY

    return { x, y }
  }
}

export const krystalliumStockLocator = new KrystalliumStockLocator()
