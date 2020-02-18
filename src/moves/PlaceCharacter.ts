import Character from '../material/characters/Character'
import Empire from '../material/empires/Empire'
import MoveType from './MoveType'

export default interface PlaceCharacter {
  type: typeof MoveType.PlaceCharacter
  playerId: Empire
  character: Character
  constructionIndex: number
  space: number
}

export function placeCharacter(playerId: Empire, character: Character, constructionIndex: number, space: number): PlaceCharacter {
  return {type: MoveType.PlaceCharacter, playerId, character, constructionIndex, space}
}