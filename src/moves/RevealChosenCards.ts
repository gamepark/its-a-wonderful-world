import Development from '../material/Development'
import Empire from '../material/Empire'
import MoveType from './MoveType'

type RevealChosenCards = { type: typeof MoveType.RevealChosenCards }

export default RevealChosenCards

export type RevealChosenCardsView<P> = RevealChosenCards
  & { revealedCards: { [key in Empire]?: Development } }

export function revealChosenCards(): RevealChosenCards {
  return {type: MoveType.RevealChosenCards}
}

export function isRevealChosenCardsView<P>(move: RevealChosenCards | RevealChosenCardsView<P>): move is RevealChosenCardsView<P> {
  return (move as RevealChosenCardsView<P>).revealedCards !== undefined
}