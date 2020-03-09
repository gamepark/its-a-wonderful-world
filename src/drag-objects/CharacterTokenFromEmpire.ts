import Character from '../material/characters/Character'
import DragObjectType from './DragObjectType'

type CharacterTokenFromEmpire = {
  type: typeof DragObjectType.CHARACTER_TOKEN_FROM_EMPIRE
  character: Character
}

export default CharacterTokenFromEmpire

export function characterTokenFromEmpire(character: Character) {
  return {type: DragObjectType.CHARACTER_TOKEN_FROM_EMPIRE, character}
}