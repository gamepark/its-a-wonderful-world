import { DeckLocator } from './DeckLocator'

class AscensionDeckLocator extends DeckLocator {
  // Position ascension deck where discard normally is (swapped when C&A active)
  coordinates = { x: -20, y: -15.5, z: 0 }
}

export const ascensionDeckLocator = new AscensionDeckLocator()
