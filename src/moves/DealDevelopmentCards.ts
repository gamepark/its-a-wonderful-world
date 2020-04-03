import MoveType from './MoveType'

type DealDevelopmentCards = { type: typeof MoveType.DealDevelopmentCards }

export default DealDevelopmentCards

export type DealDevelopmentCardsView<P> = DealDevelopmentCards & { playerCards?: number[], playerId?: P }

export function dealDevelopmentCards(): DealDevelopmentCards {
  return {type: MoveType.DealDevelopmentCards}
}

export function isDealDevelopmentCardsView<P>(move: DealDevelopmentCards | DealDevelopmentCardsView<P>): move is DealDevelopmentCardsView<P> {
  return (move as DealDevelopmentCardsView<P>).playerCards !== undefined
}