import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { LocationDescription, Locator } from '@gamepark/react-game'

class DevelopmentCardProductionLocator extends Locator {
  locationDescription = new LocationDescription({ width: 4, height: 1.3, borderRadius: 0.3 })
  parentItemType = MaterialType.DevelopmentCard
  positionOnParent = { x: 50, y: 94 }
}

export const developmentCardProductionLocator = new DevelopmentCardProductionLocator()
