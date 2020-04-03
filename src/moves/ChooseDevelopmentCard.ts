import Empire from '../material/empires/Empire'
import MoveType from './MoveType'

export default interface ChooseDevelopmentCard {
  type: typeof MoveType.ChooseDevelopmentCard
  playerId: Empire
  card: number
}

export type ChooseDevelopmentCardView = Omit<ChooseDevelopmentCard, 'card'>

export function chooseDevelopmentCard(playerId: Empire, card: number): ChooseDevelopmentCard {
  return {type: MoveType.ChooseDevelopmentCard, playerId, card}
}

export function isChooseDevelopmentCard(move: ChooseDevelopmentCard | ChooseDevelopmentCardView): move is ChooseDevelopmentCard {
  return (move as ChooseDevelopmentCard).card !== undefined
}