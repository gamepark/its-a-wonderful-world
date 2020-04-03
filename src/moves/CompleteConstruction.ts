import Empire from '../material/empires/Empire'
import MoveType from './MoveType'

export default interface CompleteConstruction {
  type: typeof MoveType.CompleteConstruction
  playerId: Empire
  card: number
}

export function completeConstruction(playerId: Empire, card: number): CompleteConstruction {
  return {type: MoveType.CompleteConstruction, playerId, card}
}