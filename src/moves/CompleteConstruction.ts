import Empire from '../material/empires/Empire'
import MoveType from './MoveType'

export default interface CompleteConstruction {
  type: typeof MoveType.CompleteConstruction
  playerId: Empire
  constructionIndex: number
}

export function completeConstruction(playerId: Empire, constructionIndex: number): CompleteConstruction {
  return {type: MoveType.CompleteConstruction, playerId, constructionIndex}
}