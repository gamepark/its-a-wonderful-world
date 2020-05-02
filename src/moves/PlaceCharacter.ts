import Character from '../material/characters/Character'
import EmpireName from '../material/empires/EmpireName'
import Move from './Move'
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

export function isPlaceCharacter(move: Move): move is PlaceCharacter {
  return move.type === MoveType.PlaceCharacter
}