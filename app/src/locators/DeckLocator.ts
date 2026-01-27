import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { DeckLocator as BaseDeckLocator, ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'

// Scale from v2 (DrawPile.tsx: drawPileScale = 0.4)
const drawPileScale = 0.4

export class DeckLocator extends BaseDeckLocator<Empire, MaterialType, LocationType> {
  // Position deck above construction area, aligned left (v2: left: 10%)
  coordinates = { x: -23.5, y: -15.5, z: 0 }
  // Half of default gap ({ x: -0.05, y: -0.05 })
  gap = { x: -0.025, y: -0.025 }

  placeItem(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>): string[] {
    return [...super.placeItem(item, context), `scale(${drawPileScale})`]
  }
}

export const deckLocator = new DeckLocator()
