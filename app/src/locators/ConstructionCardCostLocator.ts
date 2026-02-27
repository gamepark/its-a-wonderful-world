import { DragEndEvent, DragMoveEvent } from '@dnd-kit/core'
import { DropAreaDescription, isItemContext, ItemContext, Locator, MaterialContext } from '@gamepark/react-game'
import { isMoveItem, Location, MaterialItem, MaterialMove, MoveItem, MoveItemsAtOnce } from '@gamepark/rules-api'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Development, getCost, getConstructionSpaceLocation } from '@gamepark/its-a-wonderful-world/material/Development'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { developmentCardDescription } from '../material/DevelopmentCardDescription'

// Card dimensions (percentage-based positioning)
const cardWidth = 6.5
const cardHeight = 10

// Resource cube dimensions (from ResourceCubeDescription)
const cubeWidth = 0.9
const cubeHeight = 0.9

// V2 positioning constants (in em, converted to percentage of card)
const costSpaceDeltaX = 0.2
const costSpaceDeltaX2 = 1.4
const costSpaceDeltaY = (column: number, index: number) => index * 0.92 + (column === 1 ? 0.2 : 1.6)

/**
 * Locator for resource cubes placed on construction card costs.
 * Resources are placed on specific cost slots on the card using V2 column layout.
 */
class ConstructionCardCostLocator extends Locator<Empire, MaterialType, LocationType> {
  parentItemType = MaterialType.DevelopmentCard

  locationDescription = new ConstructionCardCostDropArea()

  getPositionOnParent(
    location: Location<Empire, LocationType>,
    context: MaterialContext<Empire, MaterialType, LocationType>
  ) {
    const parentIndex = location.parent
    if (!isItemContext(context) || parentIndex === undefined) return { x: 50, y: 50 }

    // Get the development card to determine column layout
    const card = context.rules.material(MaterialType.DevelopmentCard).getItem(parentIndex)
    if (!card) return { x: 50, y: 50 }

    const development = card.id.front as Development
    const space = location.x ?? 0

    // Get column and index within column using V2 pattern
    const { column, index } = getConstructionSpaceLocation(development, space)

    // Calculate position using V2 formulas (convert em to percentage of card)
    const x = ((column === 1 ? costSpaceDeltaX : costSpaceDeltaX2) * 100) / cardWidth + (cubeWidth * 100) / cardWidth / 2
    const y = (costSpaceDeltaY(column, index) * 100) / cardHeight + (cubeHeight * 100) / cardHeight / 2

    return { x, y }
  }

  placeItem(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>): string[] {
    const transform = super.placeItem(item, context)
    if (context.type === MaterialType.CharacterToken) {
      transform.push('scale(0.35)')
    }
    return transform
  }

  ignore(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>) {
    if (item.location.parent === undefined) return false
    const card = context.rules.material(MaterialType.DevelopmentCard).getItem(item.location.parent)
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return card?.location?.player !== currentView
  }

  getItemCoordinates(
    _item: MaterialItem<Empire, LocationType>,
    _context: ItemContext<Empire, MaterialType, LocationType>
  ) {
    // z-index to ensure cubes appear above the card
    return { z: 5 }
  }

  getDropLocations(moves: (MoveItem<Empire, MaterialType, LocationType> | MoveItemsAtOnce<Empire, MaterialType, LocationType>)[]): Location<Empire, LocationType>[] {
    // One drop zone per card (not per cost slot)
    const parents = new Set<number>()
    const locations: Location<Empire, LocationType>[] = []
    for (const move of moves) {
      if (isMoveItem(move) && move.location.parent !== undefined && !parents.has(move.location.parent)) {
        parents.add(move.location.parent)
        locations.push({ type: LocationType.ConstructionCardCost, parent: move.location.parent })
      }
    }
    return locations
  }
}

class ConstructionCardCostDropArea extends DropAreaDescription<Empire, MaterialType, LocationType> {
  constructor() {
    super(developmentCardDescription)
  }

  getBestDropMove(
    moves: MaterialMove<Empire, MaterialType, LocationType>[],
    _location: Location<Empire, LocationType>,
    context: ItemContext<Empire, MaterialType, LocationType>,
    _event: DragMoveEvent | DragEndEvent
  ): MaterialMove<Empire, MaterialType, LocationType> {
    if (moves.length <= 1) return moves[0]

    // Get the dragged cube's resource type
    const cube = context.rules.material(MaterialType.ResourceCube).getItem(context.index)
    const resource = cube.id as Resource

    // Get the development card to know the cost layout
    const firstMove = moves.find(isMoveItem)
    if (!firstMove || firstMove.location.parent === undefined) return moves[0]
    const card = context.rules.material(MaterialType.DevelopmentCard).getItem(firstMove.location.parent)
    const development = card.id.front as Development
    const cost = getCost(development)

    // Sort moves by cost slot index (ascending = first free slot first)
    const sortedMoves = [...moves].filter(isMoveItem).sort((a, b) => (a.location.x ?? 0) - (b.location.x ?? 0))

    if (resource === Resource.Krystallium) {
      // Krystallium: prefer slots that specifically require Krystallium
      const krystalliumSlot = sortedMoves.find(m => cost[m.location.x ?? 0] === Resource.Krystallium)
      if (krystalliumSlot) return krystalliumSlot
    }

    // Default: first free slot
    return sortedMoves[0] ?? moves[0]
  }
}

export const constructionCardCostLocator = new ConstructionCardCostLocator()
