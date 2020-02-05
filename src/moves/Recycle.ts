import Empire from '../material/Empire'
import MoveType from './MoveType'

export default interface Recycle {
  type: typeof MoveType.Recycle
  playerId: Empire
  cardIndex: number
}

export function recycle(playerId: Empire, cardIndex: number): Recycle {
  return {type: MoveType.Recycle, playerId, cardIndex}
}