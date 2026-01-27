import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Development, getConstructionSpaceLocation } from '@gamepark/its-a-wonderful-world/material/Development'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { LocationDescription, Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

const cardWidth = 6.5
const cardHeight = 10
const cubeWidth = 0.9
const cubeHeight = 0.9
const costSpaceDeltaX = 0.2
const costSpaceDeltaX2 = 1.4
const costSpaceDeltaY = (column: number, index: number) => index * 0.92 + (column === 1 ? 0.2 : 1.6)

class DevelopmentCardCostSpaceLocator extends Locator<Empire, MaterialType, LocationType> {
  locationDescription = new LocationDescription({ width: cubeWidth, height: cubeHeight, borderRadius: 0.1 })
  parentItemType = MaterialType.DevelopmentCard

  getPositionOnParent(location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    const parentIndex = location.parent
    if (parentIndex === undefined) return { x: 50, y: 50 }

    const card = context.rules.material(MaterialType.DevelopmentCard).getItem(parentIndex)
    if (!card) return { x: 50, y: 50 }

    const development = card.id.front as Development
    const space = location.x ?? 0
    const { column, index } = getConstructionSpaceLocation(development, space)

    const x = ((column === 1 ? costSpaceDeltaX : costSpaceDeltaX2) * 100) / cardWidth + (cubeWidth * 100) / cardWidth / 2
    const y = (costSpaceDeltaY(column, index) * 100) / cardHeight + (cubeHeight * 100) / cardHeight / 2

    return { x, y }
  }
}

export const developmentCardCostSpaceLocator = new DevelopmentCardCostSpaceLocator()
