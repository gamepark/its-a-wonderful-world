import Empire from '../material/Empire'
import MoveType from './MoveType'

export default interface SlateForConstruction {
  type: typeof MoveType.SlateForConstruction
  playerId: Empire
  cardIndex: number
}

export function slateForConstruction(playerId: Empire, cardIndex: number): SlateForConstruction {
  return {type: MoveType.SlateForConstruction, playerId, cardIndex}
}