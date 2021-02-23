import EmpireName from '../material/EmpireName'
import Move, {MoveView} from './Move'
import MoveType from './MoveType'

export default interface SlateForConstruction {
  type: typeof MoveType.SlateForConstruction
  playerId: EmpireName
  card: number
}

export function slateForConstruction(playerId: EmpireName, card: number): SlateForConstruction {
  return {type: MoveType.SlateForConstruction, playerId, card}
}

export function isSlateForConstruction(move: Move | MoveView): move is SlateForConstruction {
  return move.type === MoveType.SlateForConstruction
}