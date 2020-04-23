import EmpireName from '../material/empires/EmpireName'
import MoveType from './MoveType'

export default interface Recycle {
  type: typeof MoveType.Recycle
  playerId: EmpireName
  card: number
}

export function recycle(playerId: EmpireName, card: number): Recycle {
  return {type: MoveType.Recycle, playerId, card}
}