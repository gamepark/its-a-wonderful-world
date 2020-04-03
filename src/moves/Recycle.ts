import Empire from '../material/empires/Empire'
import MoveType from './MoveType'

export default interface Recycle {
  type: typeof MoveType.Recycle
  playerId: Empire
  card: number
}

export function recycle(playerId: Empire, card: number): Recycle {
  return {type: MoveType.Recycle, playerId, card}
}