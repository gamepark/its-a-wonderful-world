import Empire from '../material/empires/Empire'
import MoveType from './MoveType'

export default interface SlateForConstruction {
  type: typeof MoveType.SlateForConstruction
  playerId: Empire
  card: number
}

export function slateForConstruction(playerId: Empire, card: number): SlateForConstruction {
  return {type: MoveType.SlateForConstruction, playerId, card}
}