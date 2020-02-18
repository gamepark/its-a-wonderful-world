import Development from '../material/developments/Development'
import MoveType from './MoveType'

type DiscardLeftoverCards = { type: typeof MoveType.DiscardLeftoverCards }

export default DiscardLeftoverCards

export type DiscardLeftoverCardsView = DiscardLeftoverCards & { discardedCards: Development[] }

export function discardLeftoverCards(): DiscardLeftoverCards {
  return {type: MoveType.DiscardLeftoverCards}
}

export function isDiscardLeftoverCardsView(move: DiscardLeftoverCards | DiscardLeftoverCardsView): move is DiscardLeftoverCardsView {
  return (move as DiscardLeftoverCardsView).discardedCards != undefined
}