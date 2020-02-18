import Character from '../material/characters/Character'
import Empire from '../material/empires/Empire'
import MoveType from './MoveType'

export default interface ReceiveCharacter {
  type: typeof MoveType.ReceiveCharacter
  playerId: Empire
  character: Character
}

export function receiveCharacter(playerId: Empire, character: Character): ReceiveCharacter {
  return {type: MoveType.ReceiveCharacter, playerId, character}
}