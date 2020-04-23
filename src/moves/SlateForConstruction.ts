import EmpireName from '../material/empires/EmpireName'
import MoveType from './MoveType'

export default interface SlateForConstruction {
  type: typeof MoveType.SlateForConstruction
  playerId: EmpireName
  card: number
}

export function slateForConstruction(playerId: EmpireName, card: number): SlateForConstruction {
  return {type: MoveType.SlateForConstruction, playerId, card}
}