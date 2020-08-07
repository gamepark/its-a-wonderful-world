import EmpireName from '../material/empires/EmpireName'
import MoveType from './MoveType'

export default interface Concede {
  type: typeof MoveType.Concede
  playerId: EmpireName
}

export function concede(playerId: EmpireName): Concede {
  return {type: MoveType.Concede, playerId}
}
