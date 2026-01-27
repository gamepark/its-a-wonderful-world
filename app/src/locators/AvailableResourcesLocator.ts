import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { Resource, resources } from '@gamepark/its-a-wonderful-world/material/Resource'
import { ItemContext, PileLocator } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'

class AvailableResourcesLocator extends PileLocator<Empire, MaterialType, LocationType> {
  radius = 2.6
  maxAngle = 0
  minimumDistance = 0.8

  hide(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return item.location.player !== currentView
  }

  getCoordinates(location: Location<Empire, LocationType>): Coordinates {
    // Get the resource type from location.id
    const resource = location.id as Resource

    // Find the index of this resource type on the board
    const resourceIndex = resources.indexOf(resource)

    // Calculate the center X position of this resource's circle on the board
    const circleX = -22.1 + resourceIndex * 10.38

    return { x: circleX, y: -7.3, z: 2 }
  }
}

export const availableResourcesLocator = new AvailableResourcesLocator()
