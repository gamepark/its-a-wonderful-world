/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { Resource, resources } from '@gamepark/its-a-wonderful-world/material/Resource'
import { isLocationSubset, ItemContext, LocationDescription, Locator, MaterialContext, useRules } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem, MaterialRules, XYCoordinates } from '@gamepark/rules-api'
import { resourceCubeDescription } from '../material/ResourceCubeDescription'

const resourceColor: Record<number, string> = {
  [Resource.Materials]: '#ddd6c5',
  [Resource.Energy]: '#808080',
  [Resource.Science]: '#c5d430',
  [Resource.Gold]: '#ffed67',
  [Resource.Exploration]: '#68c7f2',
  [Resource.Krystallium]: '#d91214'
}

const AvailableResourcesContent = ({ location }: { location: Location }) => {
  const rules = useRules<MaterialRules>()!
  const count = rules
    .material(MaterialType.ResourceCube)
    .location((l) => isLocationSubset(l, location))
    .getQuantity()
  const resource = location.id as Resource

  if (count === 0) return null

  return (
    <span
      css={css`
        color: ${resourceColor[resource]};
      `}
    >
      {count}
    </span>
  )
}

class AvailableResourcesLocationDescription extends LocationDescription {
  width = 5
  height = 5
  borderRadius = 2.5

  content = AvailableResourcesContent

  extraCss = css`
    pointer-events: none;

    > span {
      position: absolute;
      top: 85%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.2em;
      font-weight: bold;
      text-shadow:
        0 0 0.15em black,
        0 0 0.15em black,
        0 0 0.15em black,
        0 0 0.15em black;
      pointer-events: none;
    }
  `
}

class AvailableResourcesLocator extends Locator<Empire, MaterialType, LocationType> {
  locationDescription = new AvailableResourcesLocationDescription()

  getLocations(context: MaterialContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    if (currentView === undefined) return []
    return resources.filter((r) => r !== Resource.Krystallium).map((resource) => ({ type: LocationType.AvailableResources, player: currentView, id: resource }))
  }

  hide(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return item.location.player !== currentView
  }

  /**
   * Cubes fill a hexagonal spiral: the first one in the center (slightly above the count), then rings of 6, 12, 18...
   */
  getItemCoordinates(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>): Coordinates {
    const { x, y, z } = this.getCoordinates(item.location)
    const { x: dx, y: dy } = toHexagonalSpiralPosition(context.displayIndex)
    return {
      x: x + (dx * resourceCubeDescription.width) / 2,
      y: y + hexagonCenterDeltaY + dy * resourceCubeDescription.height,
      z
    }
  }

  getCoordinates(location: Location<Empire, LocationType>): Coordinates {
    const resource = location.id as Resource
    const resourceIndex = resources.indexOf(resource)
    const circleX = -22.1 + resourceIndex * 10.38

    return { x: circleX, y: -7.3, z: 2 }
  }
}

const hexagonCenterDeltaY = -0.3

/**
 * Position of the nth cube in a hexagonal spiral, in half cube widths on x and cube heights on y.
 * Index 0 is the center, then each ring at distance d holds 6d cubes.
 */
const toHexagonalSpiralPosition = (index: number): XYCoordinates => {
  if (index === 0) return { x: 0, y: 0 }
  index--
  let distance = 1
  while (distance <= index / 6) {
    index -= distance * 6
    distance++
  }
  const xFactor = 2 / Math.sqrt(3)
  switch (Math.floor(index / distance)) {
    case 0:
      return { x: (distance + index) * -xFactor, y: distance - index }
    case 1:
      return { x: (index - distance * 3) * xFactor, y: distance - index }
    case 2:
      return { x: (index * 2 - distance * 5) * xFactor, y: -distance }
    case 3:
      return { x: (index - distance * 2) * xFactor, y: index - distance * 4 }
    case 4:
      return { x: (distance * 6 - index) * xFactor, y: index - distance * 4 }
    default:
      return { x: (distance * 11 - index * 2) * xFactor, y: distance }
  }
}

export const availableResourcesLocator = new AvailableResourcesLocator()
