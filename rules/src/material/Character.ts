import {isEnumValue} from '@gamepark/rules-api'

enum Character {
  Financier = 10, General // We need to avoid conflict with Development Types inside ScoreMultipliers
}

export default Character

export const characters = Object.values(Character).filter(isEnumValue)

export function isCharacter(item: any): item is Character {
  return characters.includes(item)
}

export const ChooseCharacter = 'CHOOSE_CHARACTER'