import { ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { empireCardX, empireCardY, moveUpOffset, shouldMoveUpEmpire } from './EmpireCardSpaceLocator'

class ConstructedDevelopmentsLocator extends ListLocator<Empire, MaterialType, LocationType> {
  gap = { y: -1.1 }
  maxCount = 19

  ignore(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return item.location.player !== currentView
  }

  // Constructed developments are positioned above the empire card
  getCoordinates(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    const baseY = empireCardY - 7.4
    const y = shouldMoveUpEmpire(context) ? baseY - moveUpOffset : baseY
    return { x: empireCardX, y, z: 0 }
  }
}

export const constructedDevelopmentsLocator = new ConstructedDevelopmentsLocator()
