import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { LocationDescription, Locator } from '@gamepark/react-game'

class DevelopmentCardVictoryPointsLocator extends Locator {
  locationDescription = new LocationDescription({ width: 1.5, height: 1.5, borderRadius: 0.5 })
  parentItemType = MaterialType.DevelopmentCard
  positionOnParent = { x: 10, y: 93 }
}

export const developmentCardVictoryPointsLocator = new DevelopmentCardVictoryPointsLocator()
