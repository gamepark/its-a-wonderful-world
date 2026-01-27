import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Character } from '@gamepark/its-a-wonderful-world/material/Character'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { DeckLocator } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

// Board position (from Board.tsx)
const boardY = -8

// Science circle is at index 2, each resource takes 20% of the board
// Financier stock goes to the left of science, General to the right
const financierX = -6.5
const generalX = 3.5

class CharacterStockLocator extends DeckLocator<Empire, MaterialType, LocationType> {
  /**
   * Position each stock pile based on character type
   */
  getCoordinates(location: Location<Empire, LocationType>): Coordinates {
    const character = location.id as Character
    const x = character === Character.Financier ? financierX : generalX
    return { x, y: boardY - 3, z: 0 }
  }
}

export const characterStockLocator = new CharacterStockLocator()
