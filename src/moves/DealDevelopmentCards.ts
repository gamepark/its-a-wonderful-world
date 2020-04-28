import MoveType from './MoveType'

type DealDevelopmentCards = { type: typeof MoveType.DealDevelopmentCards }

export default DealDevelopmentCards

export type DealDevelopmentCardsView = DealDevelopmentCards & { playerCards?: number[] }

export function dealDevelopmentCards(): DealDevelopmentCards {
  return {type: MoveType.DealDevelopmentCards}
}

export function isDealDevelopmentCardsView(move: DealDevelopmentCards | DealDevelopmentCardsView): move is DealDevelopmentCardsView {
  return (move as DealDevelopmentCardsView).playerCards !== undefined
}