import EmpireName from '../material/empires/EmpireName'
import MoveType from './MoveType'

export default interface CompleteConstruction {
  type: typeof MoveType.CompleteConstruction
  playerId: EmpireName
  card: number
}

export function completeConstruction(playerId: EmpireName, card: number): CompleteConstruction {
  return {type: MoveType.CompleteConstruction, playerId, card}
}