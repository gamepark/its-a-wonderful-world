import Character from '../material/characters/Character'
import EmpireName from '../material/empires/EmpireName'
import MoveType from './MoveType'

export default interface PlaceCharacter {
  type: typeof MoveType.PlaceCharacter
  playerId: EmpireName
  character: Character
  card: number
  space: number
}

export function placeCharacter(playerId: EmpireName, character: Character, card: number, space: number): PlaceCharacter {
  return {type: MoveType.PlaceCharacter, playerId, character, card, space}
}