import Character from '../material/characters/Character'
import EmpireName from '../material/empires/EmpireName'
import MoveType from './MoveType'

export default interface ReceiveCharacter {
  type: typeof MoveType.ReceiveCharacter
  playerId: EmpireName
  character: Character
}

export function receiveCharacter(playerId: EmpireName, character: Character): ReceiveCharacter {
  return {type: MoveType.ReceiveCharacter, playerId, character}
}