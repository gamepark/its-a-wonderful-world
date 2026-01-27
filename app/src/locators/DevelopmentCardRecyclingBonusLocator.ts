import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { LocationDescription, Locator } from '@gamepark/react-game'

class DevelopmentCardRecyclingBonusLocator extends Locator {
  locationDescription = new LocationDescription({ width: 1.3, height: 1.3, borderRadius: 1 })
  parentItemType = MaterialType.DevelopmentCard
  positionOnParent = { x: 89.5, y: 79 }
}

export const developmentCardRecyclingBonusLocator = new DevelopmentCardRecyclingBonusLocator()
