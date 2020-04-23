import EmpireName from '../material/empires/EmpireName'
import MoveType from './MoveType'

export default interface ChooseDevelopmentCard {
  type: typeof MoveType.ChooseDevelopmentCard
  playerId: EmpireName
  card: number
}

export type ChooseDevelopmentCardView = Omit<ChooseDevelopmentCard, 'card'>

export function chooseDevelopmentCard(playerId: EmpireName, card: number): ChooseDevelopmentCard {
  return {type: MoveType.ChooseDevelopmentCard, playerId, card}
}

export function isChooseDevelopmentCard(move: ChooseDevelopmentCard | ChooseDevelopmentCardView): move is ChooseDevelopmentCard {
  return (move as ChooseDevelopmentCard).card !== undefined
}