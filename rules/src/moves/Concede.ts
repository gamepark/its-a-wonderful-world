import EmpireName from '../material/EmpireName'
import MoveType from './MoveType'

export default interface Concede {
  type: typeof MoveType.Concede
  playerId: EmpireName
}

export function concede(playerId: EmpireName): Concede {
  return {type: MoveType.Concede, playerId}
}
