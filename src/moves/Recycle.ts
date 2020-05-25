import EmpireName from '../material/empires/EmpireName'
import Move, {MoveView} from './Move'
import MoveType from './MoveType'

export default interface Recycle {
  type: typeof MoveType.Recycle
  playerId: EmpireName
  card: number
}

export function recycle(playerId: EmpireName, card: number): Recycle {
  return {type: MoveType.Recycle, playerId, card}
}

export function isRecycle(move: Move | MoveView): move is Recycle {
  return move.type === MoveType.Recycle
}