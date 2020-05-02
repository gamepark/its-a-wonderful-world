enum Character {
  Financier = 'Financier', General = 'General'
}

export default Character

export function isCharacter(item: any): item is Character {
  return Object.values(Character).indexOf(item) !== -1
}

export const ChooseCharacter = 'CHOOSE_CHARACTER'