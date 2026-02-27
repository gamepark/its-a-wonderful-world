import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { DropAreaDescription, ItemContext, Locator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { empireCardDescription } from '../material/EmpireCardDescription'

/**
 * Locator for non-krystallium resources on the empire card.
 * Resources are placed in a star pattern on the empire card, one position per resource type.
 */
class EmpireCardResourcesLocator extends Locator<Empire, MaterialType, LocationType> {
  parentItemType = MaterialType.EmpireCard
  locationDescription = new DropAreaDescription(empireCardDescription)

  getParentItem(
    location: Location<Empire, LocationType>,
    context: MaterialContext<Empire, MaterialType, LocationType>
  ): MaterialItem<Empire, LocationType> | undefined {
    const staticItems = context.material[MaterialType.EmpireCard]?.getStaticItems(context)
    return staticItems?.find((item) => item.location.player === location.player)
  }

  hide(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return item.location.player !== currentView
  }

  getCoordinates(location: Location<Empire, LocationType>): Partial<Coordinates> {
    if (location.x === undefined) return {}
    const angle = -Math.PI / 2 + location.x * ((2 * Math.PI) / 5)
    const radius = 0.8
    return { x: radius * Math.cos(angle) - 1.5, y: radius * Math.sin(angle) + 0.5 }
  }
}

export const empireCardResourcesLocator = new EmpireCardResourcesLocator()
