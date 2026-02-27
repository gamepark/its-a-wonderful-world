/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { Resource, resources } from '@gamepark/its-a-wonderful-world/material/Resource'
import { isLocationSubset, ItemContext, LocationDescription, MaterialContext, PileLocator, useRules } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem, MaterialRules, XYCoordinates } from '@gamepark/rules-api'

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
    <span css={css`color: ${resourceColor[resource]};`}>{count}</span>
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
      text-shadow: 0 0 0.15em black, 0 0 0.15em black, 0 0 0.15em black, 0 0 0.15em black;
      pointer-events: none;
    }
  `
}

class AvailableResourcesLocator extends PileLocator<Empire, MaterialType, LocationType> {
  radius = 2.6
  maxAngle = 0
  minimumDistance = 0.8

  locationDescription = new AvailableResourcesLocationDescription()

  getLocations(context: MaterialContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    if (currentView === undefined) return []
    return resources
      .filter(r => r !== Resource.Krystallium)
      .map(resource => ({ type: LocationType.AvailableResources, player: currentView, id: resource }))
  }

  hide(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return item.location.player !== currentView
  }

  generateItemPosition(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>): XYCoordinates {
    const distance = Math.random()
    // Restrict angle to ~270° arc avoiding bottom center (π/2) where the count is displayed
    const direction = Math.random() * 1.5 * Math.PI + 0.75 * Math.PI // from 3π/4 to 9π/4 (avoids π/2)
    const radius = this.getRadius(item.location, context)
    const r = typeof radius === 'number' ? radius : radius.x
    return {
      x: Math.cos(direction) * Math.sqrt(distance) * r,
      y: Math.sin(direction) * Math.sqrt(distance) * r
    }
  }

  getCoordinates(location: Location<Empire, LocationType>): Coordinates {
    const resource = location.id as Resource
    const resourceIndex = resources.indexOf(resource)
    const circleX = -22.1 + resourceIndex * 10.38

    return { x: circleX, y: -7.3, z: 2 }
  }
}

export const availableResourcesLocator = new AvailableResourcesLocator()
