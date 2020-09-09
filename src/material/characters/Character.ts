enum Character {
  Financier = 'Financier', General = 'General'
}

export default Character

export const characterTypes = Object.values(Character) as Character[]

export function isCharacter(item: any): item is Character {
  return characterTypes.indexOf(item) !== -1
}

export const ChooseCharacter = 'CHOOSE_CHARACTER'