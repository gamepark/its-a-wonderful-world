import EmpireName from '../material/empires/EmpireName'
import Move, {MoveView} from './Move'
import MoveType from './MoveType'

export default interface CompleteConstruction {
  type: typeof MoveType.CompleteConstruction
  playerId: EmpireName
  card: number
}

export function completeConstruction(playerId: EmpireName, card: number): CompleteConstruction {
  return {type: MoveType.CompleteConstruction, playerId, card}
}

export function isCompleteConstruction(move: Move | MoveView): move is CompleteConstruction {
  return move.type === MoveType.CompleteConstruction
}