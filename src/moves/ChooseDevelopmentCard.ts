import Empire from '../material/Empire'
import MoveType from './MoveType'

export default interface ChooseDevelopmentCard {
  type: typeof MoveType.ChooseDevelopmentCard
  playerId: Empire
  cardIndex: number
}

export function chooseDevelopmentCard(playerId: Empire, cardIndex: number): ChooseDevelopmentCard {
  return {type: MoveType.ChooseDevelopmentCard, playerId, cardIndex}
}