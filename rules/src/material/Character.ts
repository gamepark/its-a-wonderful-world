import { getEnumValues } from '@gamepark/rules-api'

export enum Character {
  Financier = 10,
  General // We need to avoid conflict with Development Types inside ScoreMultipliers
}

export const characters = getEnumValues(Character)

export function isCharacter(item: any): item is Character {
  return characters.includes(item)
}
